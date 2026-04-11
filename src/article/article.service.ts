import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { IArticle } from './interfaces/IArticle';
import { EArticleStatus } from './enums/EArticleStatus';
import { randomUUID } from 'crypto';
import { CreateArticleDto } from './dto/CreateArticleDto';
import { UpdateArticleDto } from './dto/UpdateArticleDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Article, ArticleStatus } from 'prisma/generated/client';

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

async update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
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
        throw new BadRequestException(`User with id ${restData.authorId} not found`);
      }
    }

    if (restData.categoryId) {
      const category = await tx.category.findUnique({
        where: { id: restData.categoryId },
      });
      if (!category) {
        throw new BadRequestException(`Category with id ${restData.categoryId} not found`);
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