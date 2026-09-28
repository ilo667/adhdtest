import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { QuizModule } from './quiz/quiz.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, QuizModule, AuthModule],
})
export class AppModule {}
