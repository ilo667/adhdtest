import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('active')
  getActiveQuiz() {
    return this.quizService.getActiveQuiz();
  }

  @Post('attempts')
  createAttempt(@Body() dto: CreateAttemptDto) {
    return this.quizService.createAttempt(dto);
  }
}
