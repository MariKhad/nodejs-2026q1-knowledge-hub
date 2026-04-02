import { Injectable, NotFoundException, BadRequestException, UnprocessableEntityException, Inject, forwardRef } from '@nestjs/common';
import { CommentRepository } from '../database/repositories/comment.repository';
import { CreateCommentDto } from './dto/CreateCommentDto';
import { IComment } from './interfaces/IComment';
import { randomUUID } from 'crypto';
import { ArticleService } from '../article/article.service';
import { UserService } from '../user/user.service';
import { validate as isUUID } from 'uuid';

@Injectable()
export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    @Inject(forwardRef(() => ArticleService))
    private articleService: ArticleService,
    private userService: UserService,
  ) {}

  findByArticleId(articleId: string): IComment[] {
    if (!articleId) {
      throw new BadRequestException('articleId query parameter is required');
    }
    
    if (!isUUID(articleId)) {
      throw new BadRequestException(`Invalid UUID: ${articleId}`);
    }
    return this.commentRepository.findByArticleId(articleId);
  }

  findById(id: string): IComment {
    const comment = this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  async create(createCommentDto: CreateCommentDto): Promise<IComment> {
    const { content, articleId, authorId } = createCommentDto;

    try {
      const article = this.articleService.findById(articleId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException(`Article with id ${articleId} does not exist`);
      }
      throw error;
    }

  
    if (authorId) {
      const author = this.userService.findById(authorId);
      if (!author) {
        throw new BadRequestException(`User with id ${authorId} not found`);
      }
    }

    const newComment: IComment = {
      id: randomUUID(),
      content,
      articleId,
      authorId: authorId || null,
      createdAt: Date.now(),
    };

    this.commentRepository.create(newComment);
    return newComment;
  }

  delete(id: string): void {
    const deleted = this.commentRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
  }

  deleteByAuthorId(authorId: string): void {
    this.commentRepository.deleteByAuthorId(authorId);
  }

  deleteByArticleId(articleId: string): void {
    this.commentRepository.deleteByArticleId(articleId);
  }
}