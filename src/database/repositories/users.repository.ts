import { IUser } from "src/user/interfaces/IUser";
import { Database } from "../db.interface";
import { Inject } from "@nestjs/common";
import { DATABASE_CONNECTION } from "../db.provider";

export class UserRepository {
constructor(@Inject(DATABASE_CONNECTION) private db: Database) {}

  findAll(): IUser[] {
    return this.db.users;
  }

  findById(id: string): IUser| undefined {
    return this.db.users.find(user => user.id === id);
  }

  findByLogin(login: string): IUser| undefined {
    return this.db.users.find(user => user.login === login);
  }

  create(user: IUser): void {
    this.db.users.push(user);
  }

  update(id: string, updatedUser: IUser): boolean {
    const index = this.db.users.findIndex(user=> user.id === id);
    if (index === -1) return false;
    this.db.users[index] = updatedUser;
    return true;
  }

  delete(id: string): boolean {
    const initialLength = this.db.users.length;
    this.db.users = this.db.users.filter(user => user.id !== id);
    return this.db.users.length !== initialLength;
  }

  nullifyAuthorId(authorId: string): number {
    let updatedCount = 0;
    this.db.articles = this.db.articles.map(article => {
      if (article.authorId === authorId) {
        updatedCount++;
        return { ...article, authorId: null };
      }
      return article;
    });
    return updatedCount;
  }
}
