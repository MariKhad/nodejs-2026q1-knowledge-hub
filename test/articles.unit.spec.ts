import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from '../src/article/article.service';
import { EArticleStatus } from '../src/article/enums/EArticleStatus';
import { CategoryService } from '../src/category/category.service';
import { CommentService } from '../src/comment/comment.service';
import { ArticleRepository } from '../src/database/repositories/article.repository';
import { UserService } from '../src/user/user.service';


describe('ArticleService', () => {
  let service: ArticleService;
  let articleRepository: ArticleRepository;
  let userService: UserService;
  let categoryService: CategoryService;
  let commentService: CommentService;

  const mockArticle = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Article',
    content: 'Test content',
    status: EArticleStatus.DRAFT,
    authorId: null,
    categoryId: null,
    tags: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: ArticleRepository,
          useValue: {
            findByFilters: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            nullifyAuthorId: jest.fn(),
            nullifyCategoryId: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: CommentService,
          useValue: {
            deleteByArticleId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    articleRepository = module.get<ArticleRepository>(ArticleRepository);
    userService = module.get<UserService>(UserService);
    categoryService = module.get<CategoryService>(CategoryService);
    commentService = module.get<CommentService>(CommentService);
  });


  it('should return article by id', () => {
    jest.spyOn(articleRepository, 'findById').mockReturnValue(mockArticle);

    const result = service.findById(mockArticle.id);

    expect(result).toEqual(mockArticle);
  });


  it('should throw NotFoundException when article not found', () => {
    jest.spyOn(articleRepository, 'findById').mockReturnValue(undefined);

    expect(() => service.findById('invalid-id')).toThrow(NotFoundException);
  });

  it('should create article', async () => {
    const createDto = {
      title: 'New Article',
      content: 'Content',
      status: EArticleStatus.DRAFT,
      authorId: null,
      categoryId: null,
      tags: [],
    };

    jest.spyOn(articleRepository, 'create').mockImplementation(() => {});

    const result = await service.create(createDto);

    expect(result).toHaveProperty('id');
    expect(result.title).toBe('New Article');
  });

  it('should delete article and related comments', () => {
    jest.spyOn(articleRepository, 'findById').mockReturnValue(mockArticle);
    jest.spyOn(commentService, 'deleteByArticleId').mockReturnValue(undefined);
    jest.spyOn(articleRepository, 'delete').mockReturnValue(true);

    expect(() => service.delete(mockArticle.id)).not.toThrow();
    expect(commentService.deleteByArticleId).toHaveBeenCalledWith(mockArticle.id);
    expect(articleRepository.delete).toHaveBeenCalledWith(mockArticle.id);
  });
});