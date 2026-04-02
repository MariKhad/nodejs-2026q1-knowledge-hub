import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import { UserRepository } from '../src/database/repositories/users.repository';
import { CommentService } from '../src/comment/comment.service';
import { ArticleService } from '../src/article/article.service';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { EUserRole } from '../src/user/enums/EUserRole';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    login: 'testuser',
    password: 'hashedpassword',
    role: EUserRole.VIEWER,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByLogin: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: CommentService,
          useValue: {
            deleteByAuthorId: jest.fn(),
          },
        },
        {
          provide: ArticleService,
          useValue: {
            nullifyAuthorId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });


  it('should return all users without passwords', () => {
    jest.spyOn(userRepository, 'findAll').mockReturnValue([mockUser]);

    const result = service.findAll();

    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).not.toHaveProperty('password');
  });

  it('should return user by id without password', () => {
    jest.spyOn(userRepository, 'findById').mockReturnValue(mockUser);

    const result = service.findById(mockUser.id);

    expect(result).not.toHaveProperty('password');
    expect(result.id).toBe(mockUser.id);
  });


  it('should throw NotFoundException when user not found', () => {
    jest.spyOn(userRepository, 'findById').mockReturnValue(undefined);

    expect(() => service.findById('invalid-id')).toThrow(NotFoundException);
  });

  it('should delete user', () => {
    jest.spyOn(userRepository, 'findById').mockReturnValue(mockUser);
    jest.spyOn(userRepository, 'delete').mockReturnValue(true);

    expect(() => service.delete(mockUser.id)).not.toThrow();
    expect(userRepository.delete).toHaveBeenCalledWith(mockUser.id);
  });
});