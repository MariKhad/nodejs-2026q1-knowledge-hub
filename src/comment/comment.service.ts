import { Injectable, NotFoundException, BadRequestException, UnprocessableEntityException} from '@nestjs/common';
import { CreateCommentDto } from './dto/CreateCommentDto';
import { randomUUID } from 'crypto';
import { validate as isUUID } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { Comment } from '../../prisma/generated/client';


@Injectable()
export class CommentService {
  constructor(
    private prismaService: PrismaService) {}

async findByArticleId(articleId: string): Promise<Comment[]> {
  if (!articleId) {
    throw new BadRequestException('articleId query parameter is required');
  }
  
  if (!isUUID(articleId)) {
    throw new BadRequestException(`Invalid UUID: ${articleId}`);
  }

  const article = await this.prismaService.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    throw new NotFoundException(`Article with id ${articleId} not found`);
  }

  return this.prismaService.comment.findMany({
    where: { articleId },
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
      createdAt: 'asc', // сортируем по дате создания (старые сверху)
    },
  });
}

async findById(id: string): Promise<Comment> {
  const comment = await this.prismaService.comment.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          login: true,
          role: true,
        },
      },
      article: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    },
  });

  if (!comment) {
    throw new NotFoundException(`Comment with id ${id} not found`);
  }

  return comment;
}
async create(createCommentDto: CreateCommentDto): Promise<Comment> {
  const { content, articleId, authorId } = createCommentDto;

  const article = await this.prismaService.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    throw new UnprocessableEntityException(`Article with id ${articleId} does not exist`);
  }

  if (authorId) {
    const author = await this.prismaService.user.findUnique({
      where: { id: authorId },
    });
    if (!author) {
      throw new BadRequestException(`User with id ${authorId} not found`);
    }
  }

  const newComment = await this.prismaService.comment.create({
    data: {
      id: randomUUID(),
      content,
      articleId,
      authorId: authorId || null,
    },
    include: {
      author: {
        select: {
          id: true,
          login: true,
          role: true,
        },
      },
    },
  });

  return newComment;
}

async delete(id: string): Promise<void> {
  const comment = await this.prismaService.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new NotFoundException(`Comment with id ${id} not found`);
  }

  await this.prismaService.comment.delete({
    where: { id },
  });
}

}