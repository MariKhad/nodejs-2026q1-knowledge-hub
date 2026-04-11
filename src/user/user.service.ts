import { Injectable, NotFoundException, BadRequestException, ForbiddenException, forwardRef, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdatePasswordDto } from './dto/UpdatePasswordDto';
import { IUser } from './interfaces/IUser';
import { EUserRole } from './enums/EUserRole';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UserRepository } from '../database/repositories/users.repository';
import { CommentService } from '../comment/comment.service';
import { ArticleService } from '../article/article.service';

@Injectable()
export class UserService {
  constructor(    
    private userRepository: UserRepository,
    @Inject(forwardRef(() => CommentService))
    private commentService: CommentService,  
    @Inject(forwardRef(() => ArticleService))
    private articleService: ArticleService
  ) {}

  private excludePassword(user: IUser): Omit<IUser, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  findAll(): Omit<IUser, 'password'>[] {
    return this.userRepository.findAll().map(user => this.excludePassword(user));
  }

  findById(id: string): Omit<IUser, 'password'> {
    const user = this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.excludePassword(user);
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<IUser, 'password'>> {
    const { login, password, role = EUserRole.VIEWER } = createUserDto;

    const existingUser = this.userRepository.findByLogin(login);
    if (existingUser) {
      throw new BadRequestException(`User with login "${login}" already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = Date.now();

    const newUser: IUser = {
      id: randomUUID(),
      login,
      password: hashedPassword,
      role,
      createdAt: now,
      updatedAt: now,
    };

    this.userRepository.create(newUser);
    return this.excludePassword(newUser);
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<Omit<IUser, 'password'>> {
    const { oldPassword, newPassword } = updatePasswordDto;

    const user = this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.updatedAt = Date.now();

    this.userRepository.update(id, user);
    return this.excludePassword(user);
  }

  delete(id: string): void {
    const user = this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    this.articleService.nullifyAuthorId(id);
    this.commentService.deleteByAuthorId(id); 

    const deleted = this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}