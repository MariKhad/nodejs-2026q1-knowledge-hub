import { ICategory } from 'src/category/interfaces/ICategory';
import { Database } from '../db.interface';


class CategoryRepository {
  private data: Database;

  constructor(data: Database) {
    this.data = data;
  }

  findAll(): ICategory[] {
    return this.data.categories;
  }

  findById(id: string): ICategory | undefined {
    return this.data.categories.find(category => category.id === id);
  }

  findByName(name: string): ICategory | undefined {
    return this.data.categories.find(category => category.name === name);
  }

  create(category: ICategory): void {
    this.data.categories.push(category);
  }

  update(id: string, updatedCategory: ICategory): boolean {
    const index = this.data.categories.findIndex(category => category.id === id);
    if (index === -1) return false;
    this.data.categories[index] = updatedCategory;
    return true;
  }

  delete(id: string): boolean {
    const initialLength = this.data.categories.length;
    this.data.categories = this.data.categories.filter(category => category.id !== id);
    return this.data.categories.length !== initialLength;
  }
}

export const categoryRepository = (data: Database) => new CategoryRepository(data);