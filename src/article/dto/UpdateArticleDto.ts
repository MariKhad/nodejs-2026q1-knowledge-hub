import { PartialType } from '@nestjs/swagger';
import { CreateArticleDto } from './CreateArticleDto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
