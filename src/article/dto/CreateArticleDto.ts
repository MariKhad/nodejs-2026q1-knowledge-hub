import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleStatus } from '../../../src/generated/prisma';

export class CreateArticleDto {
  @ApiProperty({
    example: 'Understanding NestJS Modules',
    description: 'Title of the article',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    example:
      'NestJS modules are the building blocks of a NestJS application...',
    description: 'Content of the article',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional({
    enum: ArticleStatus,
    example: ArticleStatus.DRAFT,
    description: 'Status of the article (default: draft)',
    default: ArticleStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus = ArticleStatus.DRAFT;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the author (User)',
  })
  @IsOptional()
  @IsUUID()
  authorId?: string | null;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'ID of the category',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiPropertyOptional({
    example: ['nestjs', 'typescript', 'api'],
    description: 'Array of tags',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
