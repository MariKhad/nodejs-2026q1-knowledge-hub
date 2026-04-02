import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdatePasswordDto } from './dto/UpdatePasswordDto';
import { User } from './interfaces/IUser';
import { EUserRole } from './enums/EUserRole';
import { db } from '../database/db.interface';

@Injectable()
export class UserService {
  private excludePassword(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  findAll(): Omit<User, 'password'>[] {
    return db.users.map(user => this.excludePassword(user));
  }

  findById(id: string): Omit<User, 'password'> {
    const user = db.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.excludePassword(user);
  }

  findByIdWithPassword(id: string): User | undefined {
    return db.users.find(u => u.id === id);
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { login, password, role = EUserRole.VIEWER } = createUserDto;

    const existingUser = db.users.find(u => u.login === login);
    if (existingUser) {
      throw new BadRequestException(`User with login "${login}" already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = Date.now();

    const newUser: User = {
      id: randomUUID(),
      login,
      password: hashedPassword,
      role,
      createdAt: now,
      updatedAt: now,
    };

    db.users.push(newUser);
    return this.excludePassword(newUser);
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<Omit<User, 'password'>> {
    const { oldPassword, newPassword } = updatePasswordDto;

    const user = db.users.find(u => u.id === id);
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

    return this.excludePassword(user);
  }

  delete(id: string): void {
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    db.users.splice(userIndex, 1);
  }

  getUserEntity(id: string): User | undefined {
    return db.users.find(u => u.id === id);
  }
}