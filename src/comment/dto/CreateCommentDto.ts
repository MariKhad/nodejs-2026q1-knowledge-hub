import {
  IsString,
  IsUUID,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 'This is a great article! Very informative.',
    description: 'Comment content',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the article being commented on',
  })
  @IsUUID()
  articleId: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'ID of the comment author (if not provided, authorId = null)',
  })
  @IsOptional()
  @IsUUID()
  authorId?: string;
}
