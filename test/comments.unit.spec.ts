import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from '../src/comment/comment.service';
import { CommentRepository } from '../src/database/repositories/comment.repository';
import { ArticleService } from '../src/article/article.service';
import { UserService } from '../src/user/user.service';
import { NotFoundException, BadRequestException, UnprocessableEntityException } from '@nestjs/common';

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: CommentRepository;

  const mockComment = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    content: 'Test comment',
    articleId: '123e4567-e89b-12d3-a456-426614174001',
    authorId: '123e4567-e89b-12d3-a456-426614174002',
    createdAt: Date.now(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: CommentRepository,
          useValue: {
            findByArticleId: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            deleteByAuthorId: jest.fn(),
            deleteByArticleId: jest.fn(),
          },
        },
        {
          provide: ArticleService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
  });

  it('should return comment by id', () => {
    jest.spyOn(commentRepository, 'findById').mockReturnValue(mockComment);

    const result = service.findById(mockComment.id);

    expect(result).toEqual(mockComment);
  });

  it('should throw NotFoundException when comment not found', () => {
    jest.spyOn(commentRepository, 'findById').mockReturnValue(undefined);

    expect(() => service.findById('invalid-id')).toThrow(NotFoundException);
  });

  it('should throw BadRequestException when articleId is not valid UUID', () => {
    expect(() => service.findByArticleId('invalid-uuid')).toThrow(BadRequestException);
  });

  it('should delete comment', () => {
    jest.spyOn(commentRepository, 'delete').mockReturnValue(true);

    expect(() => service.delete(mockComment.id)).not.toThrow();
    expect(commentRepository.delete).toHaveBeenCalledWith(mockComment.id);
  });
});