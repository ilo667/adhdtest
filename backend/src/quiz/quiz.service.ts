import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';

type ActiveQuestionRow = {
  version_id: number;
  question_id: number;
  question_key: string;
  question_text: string;
  position: number;
};

type QuestionRow = {
  id: number;
};

@Injectable()
export class QuizService {
  constructor(private readonly database: DatabaseService) {}

  async getActiveQuiz() {
    const { rows } = await this.database.query<ActiveQuestionRow>(
      `
        SELECT
          qv.id AS version_id,
          q.id  AS question_id,
          q.question_key,
          q.question_text,
          q.position
        FROM quiz_versions qv
        JOIN questions q ON q.quiz_version_id = qv.id
        WHERE qv.is_active = TRUE
        ORDER BY q.position ASC
      `,
    );

    if (!rows.length) {
      throw new NotFoundException('Active quiz not found');
    }

    const versionId = Number(rows[0].version_id);

    const questions = rows.map((row) => ({
      id: Number(row.question_id),
      key: row.question_key,
      prompt: row.question_text,
      position: Number(row.position),
    }));

    return { versionId, questions };
  }

  async createAttempt(dto: CreateAttemptDto) {
    const { rows: questions } = await this.database.query<QuestionRow>(
      `
        SELECT id FROM questions WHERE quiz_version_id = $1 ORDER BY position ASC
      `,
      [dto.versionId],
    );

    if (!questions.length) {
      throw new NotFoundException('Quiz version not found');
    }

    const expectedIds = new Set(questions.map((q) => Number(q.id)));
    const submittedIds = new Set(dto.answers.map((a) => a.questionId));

    if (
      dto.answers.length !== expectedIds.size ||
      submittedIds.size !== expectedIds.size ||
      [...submittedIds].some((id) => !expectedIds.has(id))
    ) {
      throw new BadRequestException('All quiz questions must be answered exactly once');
    }

    const score = dto.answers.reduce((total, a) => total + a.value, 0);
    const maxScore = questions.length * 4;
    const highAnswerCount = dto.answers.filter((a) => a.value >= 3).length;
    const result = highAnswerCount >= 2 ? 'HIGH' : 'LOW';
    const attemptToken = randomUUID();

    const attempt = await this.database.query<{ id: number }>(
      `
        INSERT INTO quiz_attempts (quiz_version_id, attempt_token, score, max_score, result)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `,
      [dto.versionId, attemptToken, score, maxScore, result],
    );

    const attemptId = attempt.rows[0].id;

    for (const answer of dto.answers) {
      await this.database.query(
        `INSERT INTO answers (attempt_id, question_id, answer_value) VALUES ($1, $2, $3)`,
        [attemptId, answer.questionId, answer.value],
      );
    }

    return { attemptToken, result, score, maxScore };
  }
}
