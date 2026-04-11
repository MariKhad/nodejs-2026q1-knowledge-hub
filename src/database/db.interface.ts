import { IUser } from '../user/interfaces/IUser';
import { IArticle } from '../article/interfaces/IArticle';
import { ICategory } from '../category/interfaces/ICategory';
import { IComment } from '../comment/interfaces/IComment';

export interface Database {
  users: IUser[];
  articles: IArticle[];
  categories: ICategory[];
  comments: IComment[];
}