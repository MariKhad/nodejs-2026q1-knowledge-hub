import { ICategory } from 'src/category/interfaces/ICategory';
import { Database } from '../db.interface';
import { DATABASE_CONNECTION } from '../db.provider';
import { Inject } from '@nestjs/common';


export class CategoryRepository {
constructor(@Inject(DATABASE_CONNECTION) private db: Database) {}

  findAll(): ICategory[] {
    return this.db.categories;
  }

  findById(id: string): ICategory | undefined {
    return this.db.categories.find(category => category.id === id);
  }

  findByName(name: string): ICategory | undefined {
    return this.db.categories.find(category => category.name === name);
  }

  create(category: ICategory): void {
    this.db.categories.push(category);
  }

  update(id: string, updatedCategory: ICategory): boolean {
    const index = this.db.categories.findIndex(category => category.id === id);
    if (index === -1) return false;
    this.db.categories[index] = updatedCategory;
    return true;
  }

  delete(id: string): boolean {
    const initialLength = this.db.categories.length;
    this.db.categories = this.db.categories.filter(category => category.id !== id);
    return this.db.categories.length !== initialLength;
  }
}

export const categoryRepository = (data: Database) => new CategoryRepository(data);