import {
  ArrayMinSize,
  IsArray,
  IsInt,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuizAnswerDto {
  @IsInt()
  questionId: number;

  @IsInt()
  @Min(0)
  @Max(4)
  value: number;
}

export class CreateAttemptDto {
  @IsInt()
  versionId: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerDto)
  answers: QuizAnswerDto[];
}
