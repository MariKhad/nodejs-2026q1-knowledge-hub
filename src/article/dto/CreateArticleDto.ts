import { IsString, IsOptional, IsEnum, IsArray, IsUUID, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EArticleStatus } from '../enums/EArticleStatus';

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
    example: 'NestJS modules are the building blocks of a NestJS application...',
    description: 'Content of the article',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional({
    enum: EArticleStatus,
    example: EArticleStatus.DRAFT,
    description: 'Status of the article (default: draft)',
    default: EArticleStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(EArticleStatus)
  status?: EArticleStatus = EArticleStatus.DRAFT;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the author (User)',
  })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'ID of the category',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

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