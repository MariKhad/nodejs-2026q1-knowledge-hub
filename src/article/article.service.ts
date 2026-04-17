import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateArticleDto } from './dto/CreateArticleDto';
import { UpdateArticleDto } from './dto/UpdateArticleDto';
import { PrismaService } from '../prisma/prisma.service';
import { Article, ArticleStatus } from '../../src/generated/prisma';

@Injectable()
export class ArticleService {
  constructor(private prismaService: PrismaService) {}

  async findAll(
    status?: ArticleStatus,
    categoryId?: string,
    tag?: string,
  ): Promise<Article[]> {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (tag) {
      where.tags = {
        some: {
          name: tag,
        },
      };
    }

    return this.prismaService.article.findMany({
      where,
      include: {
        author: true,
        category: true,
        tags: true,
        comments: true,
      },
    });
  }

  async findById(id: string): Promise<Article> {
    const article = await this.prismaService.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            login: true,
            role: true,
          },
        },
        category: true,
        tags: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                login: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    return article;
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const {
      title,
      content,
      status = ArticleStatus.DRAFT,
      authorId,
      categoryId,
      tags = [],
    } = createArticleDto;
    if (authorId) {
      const author = await this.prismaService.user.findUnique({
        where: { id: authorId },
      });
      if (!author) {
        throw new BadRequestException(`User with id ${authorId} not found`);
      }
    }

    if (categoryId) {
      const category = await this.prismaService.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new BadRequestException(
          `Category with id ${categoryId} not found`,
        );
      }
    }

    const newArticle = await this.prismaService.article.create({
      data: {
        id: randomUUID(),
        title,
        content,
        status: status as ArticleStatus,
        authorId: authorId || null,
        categoryId: categoryId || null,
        tags: {
          connectOrCreate: tags.map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            login: true,
            role: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    return newArticle;
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const { tags, ...restData } = updateArticleDto;

    return this.prismaService.$transaction(async (tx) => {
      const existingArticle = await tx.article.findUnique({
        where: { id },
      });

      if (!existingArticle) {
        throw new NotFoundException(`Article with id ${id} not found`);
      }

      if (restData.authorId) {
        const author = await tx.user.findUnique({
          where: { id: restData.authorId },
        });
        if (!author) {
          throw new BadRequestException(
            `User with id ${restData.authorId} not found`,
          );
        }
      }

      if (restData.categoryId) {
        const category = await tx.category.findUnique({
          where: { id: restData.categoryId },
        });
        if (!category) {
          throw new BadRequestException(
            `Category with id ${restData.categoryId} not found`,
          );
        }
      }

      await tx.article.update({
        where: { id },
        data: {
          title: restData.title,
          content: restData.content,
          status: restData.status,
          authorId: restData.authorId,
          categoryId: restData.categoryId,
          updatedAt: new Date(),
        },
      });

      if (tags) {
        await tx.article.update({
          where: { id },
          data: {
            tags: {
              set: [],
              connectOrCreate: tags.map((tagName: string) => ({
                where: { name: tagName },
                create: { name: tagName },
              })),
            },
          },
        });
      }

      return tx.article.findUnique({
        where: { id },
        include: {
          author: {
            select: { id: true, login: true, role: true },
          },
          category: true,
          tags: true,
        },
      }) as Promise<Article>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$transaction(async (tx) => {
      const article = await tx.article.findUnique({
        where: { id },
      });

      if (!article) {
        throw new NotFoundException(`Article with id ${id} not found`);
      }

      await tx.article.delete({
        where: { id },
      });
    });
  }
}
