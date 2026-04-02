import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../src/category/category.service';
import { CategoryRepository } from '../src/database/repositories/category.repository';
import { NotFoundException } from '@nestjs/common';
import { ArticleService } from '../src/article/article.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: CategoryRepository;

  const mockCategory = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Technology',
    description: 'Tech articles',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ArticleService,
          useValue: {
            nullifyCategoryId: jest.fn(), // только то, что реально используется
          },
        }
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  // ТЕСТ 1: findAll возвращает массив
  it('should return array when findAll is called', () => {
    jest.spyOn(categoryRepository, 'findAll').mockReturnValue([mockCategory]);
    const result = service.findAll();
    expect(Array.isArray(result)).toBe(true);
  });

  // ТЕСТ 2: findById возвращает категорию
  it('should return category when findById is called', () => {
    jest.spyOn(categoryRepository, 'findById').mockReturnValue(mockCategory);
    const result = service.findById(mockCategory.id);
    expect(result).toEqual(mockCategory);
  });

  // ТЕСТ 3: findById выбрасывает 404
  it('should throw NotFoundException when category not found', () => {
    jest.spyOn(categoryRepository, 'findById').mockReturnValue(undefined);
    expect(() => service.findById('invalid-id')).toThrow(NotFoundException);
  });

  // ТЕСТ 4: delete удаляет категорию
  it('should delete category when exists', () => {
    jest.spyOn(categoryRepository, 'delete').mockReturnValue(true);
    expect(() => service.delete(mockCategory.id)).not.toThrow();
  });
});