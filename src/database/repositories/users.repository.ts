import { IUser } from "src/user/interfaces/IUser";
import { Database } from "./db.interface";

class UserRepository {
  private data: Database;

  constructor(data: Database) {
    this.data = data;
  }

  findAll(): IUser[] {
    return this.data.users;
  }

  findById(id: string): IUser| undefined {
    return this.data.users.find(user => user.id === id);
  }

  findByLogin(login: string): IUser| undefined {
    return this.data.users.find(user => user.login === login);
  }

  create(user: IUser): void {
    this.data.users.push(user);
  }

  update(id: string, updatedUser: IUser): boolean {
    const index = this.data.users.findIndex(user=> user.id === id);
    if (index === -1) return false;
    this.data.users[index] = updatedUser;
    return true;
  }

  delete(id: string): boolean {
    const initialLength = this.data.users.length;
    this.data.users = this.data.users.filter(user => user.id !== id);
    return this.data.users.length !== initialLength;
  }

  nullifyAuthorId(authorId: string): number {
    let updatedCount = 0;
    this.data.articles = this.data.articles.map(article => {
      if (article.authorId === authorId) {
        updatedCount++;
        return { ...article, authorId: null };
      }
      return article;
    });
    return updatedCount;
  }
}

export const userRepository = (data: Database) => new UserRepository(data);