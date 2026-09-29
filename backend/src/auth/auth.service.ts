import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { DatabaseService } from '../database/database.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface UserRow { id: number; email: string; password_hash: string; created_at: Date }
interface AttemptRow { result: string; score: number; max_score: number; completed_at: Date }

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async register(dto: RegisterDto) {
    const existing = await this.db.query<UserRow>(
      'SELECT id FROM users WHERE email = $1',
      [dto.email],
    );
    if (existing.rows.length) {
      throw new ConflictException('Email already registered');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    let user: UserRow;
    try {
      const { rows } = await this.db.query<UserRow>(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
        [dto.email, hash],
      );
      user = rows[0];
    } catch (err: unknown) {
      const pgErr = err as { code?: string };
      if (pgErr?.code === '23505') throw new ConflictException('Email already registered');
      throw new InternalServerErrorException();
    }

    if (dto.attemptToken) {
      await this.db.query(
        'UPDATE quiz_attempts SET user_id = $1 WHERE attempt_token = $2 AND user_id IS NULL',
        [user.id, dto.attemptToken],
      );
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET ?? 'dev-secret-change-me', { expiresIn: '7d' });
    const latestAttempt = await this.getLatestAttempt(user.id);
    return { user: { id: user.id, email: user.email }, token, latestAttempt };
  }

  async login(dto: LoginDto) {
    const { rows } = await this.db.query<UserRow>(
      'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
      [dto.email],
    );
    const user = rows[0];
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET ?? 'dev-secret-change-me', { expiresIn: '7d' });
    const latestAttempt = await this.getLatestAttempt(user.id);
    return { user: { id: user.id, email: user.email }, token, latestAttempt };
  }

  async getMe(userId: number) {
    const { rows } = await this.db.query<UserRow>(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [userId],
    );
    if (!rows.length) throw new UnauthorizedException('User not found');
    const user = rows[0];
    const latestAttempt = await this.getLatestAttempt(userId);
    return { user: { id: user.id, email: user.email }, latestAttempt };
  }

  async linkAttempt(userId: number, attemptToken: string) {
    await this.db.query(
      'UPDATE quiz_attempts SET user_id = $1 WHERE attempt_token = $2 AND user_id IS NULL',
      [userId, attemptToken],
    );
  }

  private async getLatestAttempt(userId: number) {
    const { rows } = await this.db.query<AttemptRow>(
      `SELECT result, score, max_score, completed_at
       FROM quiz_attempts
       WHERE user_id = $1
       ORDER BY completed_at DESC
       LIMIT 1`,
      [userId],
    );
    if (!rows[0]) return null;
    const { max_score, ...rest } = rows[0];
    return { ...rest, maxScore: max_score };
  }
}