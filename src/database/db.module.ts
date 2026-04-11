import { Database } from './db.interface';
import { IUser } from '../user/interfaces/IUser';
import { IArticle } from '../article/interfaces/IArticle';
import { ICategory } from '../category/interfaces/ICategory';
import { IComment } from '../comment/interfaces/IComment';

class InMemoryDB implements Database {
  private static instance: InMemoryDB;
  
  public users: IUser[] = [];
  public articles: IArticle[] = [];
  public categories: ICategory[] = [];
  public comments: IComment[] = [];

  private constructor() {}

  public static getInstance(): InMemoryDB {
    if (!InMemoryDB.instance) {
      InMemoryDB.instance = new InMemoryDB();
    }
    return InMemoryDB.instance;
  }

  public clear(): void {
    this.users = [];
    this.articles = [];
    this.categories = [];
    this.comments = [];
  }
}

export const db = InMemoryDB.getInstance();