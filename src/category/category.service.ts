import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { CreateCategoryDto } from './dto/CreateCategoryDto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '../../src/generated/prisma';


@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

async findAll(): Promise<Category[]> {
    return await this.prismaService.category.findMany();
  }

async findById(id: string): Promise<Category> {
  const category = await this.prismaService.category.findUnique({
    where: { id },
  });
  
  if (!category) {
    throw new NotFoundException(`Category with id ${id} not found`);
  }
  
  return category;
}

async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
  const { name, description } = createCategoryDto;

  const newCategory = await this.prismaService.category.create({
    data: {
      id: randomUUID(),
      name,
      description,
    },
  });

  return newCategory;
}

async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {

  const existingCategory = await this.prismaService.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new NotFoundException(`Category with id ${id} not found`);
  }

  const updatedCategory = await this.prismaService.category.update({
    where: { id },
    data: updateCategoryDto,
  });

  return updatedCategory;
}

async delete(id: string): Promise<void> {
  try {
    await this.prismaService.category.delete({
      where: { id },
    });
  } catch (error) {
    if (error.code === 'P2025') { // Record not found
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    throw error;
  }
}
}