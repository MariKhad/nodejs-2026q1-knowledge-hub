import { Injectable, NotFoundException, BadRequestException, ForbiddenException, forwardRef, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdatePasswordDto } from './dto/UpdatePasswordDto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { Role, User } from '../../src/generated/prisma';

@Injectable()
export class UserService {
  constructor(    
    private prismaService: PrismaService
  ) {}

  private excludePassword(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

 async findAll(): Promise<Omit<User, 'password'>[]> {
  const users = await this.prismaService.user.findMany();
  return users.map(user => this.excludePassword(user));
}

async findById(id: string): Promise<Omit<User, 'password'>> {
  const user = await this.prismaService.user.findUnique({
    where: { id },
  });
  
  if (!user) {
    throw new NotFoundException(`User with id ${id} not found`);
  }
  
  return this.excludePassword(user);
}

async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
  const { login, password, role = Role.VIEWER } = createUserDto;

  const existingUser = await this.prismaService.user.findUnique({
    where: { login },
  });
  
  if (existingUser) {
    throw new BadRequestException(`User with login "${login}" already exists`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const now = new Date();

  const newUser = await this.prismaService.user.create({
    data: {
      id: randomUUID(),
      login,
      password: hashedPassword,
      role,
    },
  });

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword as Omit<User, 'password'>;
}

async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<Omit<User, 'password'>> {
  const { oldPassword, newPassword } = updatePasswordDto;

  const updatedUser = await this.prismaService.$transaction(async (tx) => {

    const user = await tx.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    return tx.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    });
  });

  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
}

 async delete(id: string): Promise<void> {
  try {
    await this.prismaService.user.delete({
      where: { id },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    throw error;
  }
}
}