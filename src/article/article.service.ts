import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { ArticleRepository } from '../database/repositories/article.repository';
import { IArticle } from './interfaces/IArticle';
import { EArticleStatus } from './enums/EArticleStatus';
import { randomUUID } from 'crypto';
import { CreateArticleDto } from './dto/CreateArticleDto';
import { UpdateArticleDto } from './dto/UpdateArticleDto';
import { CommentService } from '../comment/comment.service';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ArticleService {
  constructor(
    private articleRepository: ArticleRepository,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    @Inject(forwardRef(() => CommentService))
    private commentService: CommentService,
  ) {}

  findAll(status?: EArticleStatus, categoryId?: string, tag?: string): IArticle[] {
    return this.articleRepository.findByFilters({ status, categoryId, tag });
  }

  findById(id: string): IArticle {
    const article = this.articleRepository.findById(id);
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return article;
  }

  async create(createArticleDto: CreateArticleDto): Promise<IArticle> {
    const { title, content, status = EArticleStatus.DRAFT, authorId, categoryId, tags = [] } = createArticleDto;

    if (authorId) {
      const author = this.userService.findById(authorId);
      if (!author) {
        throw new BadRequestException(`User with id ${authorId} not found`);
      }
    }

    if (categoryId) {
      const category = this.categoryService.findById(categoryId);
      if (!category) {
        throw new BadRequestException(`Category with id ${categoryId} not found`);
      }
    }

    const now = Date.now();
    const newArticle: IArticle = {
      id: randomUUID(),
      title,
      content,
      status,
      authorId: authorId || null,
      categoryId: categoryId || null,
      tags,
      createdAt: now,
      updatedAt: now,
    };

    this.articleRepository.create(newArticle);
    return newArticle;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<IArticle> {
    const article = this.articleRepository.findById(id);
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    if (updateArticleDto.authorId) {
      const author = this.userService.findById(updateArticleDto.authorId);
      if (!author) {
        throw new BadRequestException(`User with id ${updateArticleDto.authorId} not found`);
      }
    }

    if (updateArticleDto.categoryId) {
      const category = this.categoryService.findById(updateArticleDto.categoryId);
      if (!category) {
        throw new BadRequestException(`Category with id ${updateArticleDto.categoryId} not found`);
      }
    }

    const updatedArticle = {
      ...article,
      ...updateArticleDto,
      updatedAt: Date.now(),
    };

    this.articleRepository.update(id, updatedArticle);
    return updatedArticle;
  }

  delete(id: string): void {
    const article = this.articleRepository.findById(id);
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    
    this.commentService.deleteByArticleId(id);
    const deleted = this.articleRepository.delete(id);


    if (!deleted) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
  }

  nullifyAuthorId(authorId: string): void {
    this.articleRepository.nullifyAuthorId(authorId);
  }

  nullifyCategoryId(categoryId: string): number {
    const result = this.articleRepository.nullifyCategoryId(categoryId);
    return result;
  }
  
}