import { IArticle } from "src/article/interfaces/IArticle";
import { Database } from "../db.interface";
import { DATABASE_CONNECTION } from "../db.provider";
import { Inject } from "@nestjs/common";

export class ArticleRepository {
constructor(@Inject(DATABASE_CONNECTION) private db: Database) {}

  findAll(): IArticle[] {
    return this.db.articles;
  }

  findById(id: string): IArticle | undefined {
    return this.db.articles.find(article => article.id === id);
  }

  findByFilters(filters: { status?: string; categoryId?: string; tag?: string }): IArticle[] {
    let filtered = [...this.db.articles];
    
    if (filters.status) {
      filtered = filtered.filter(a => a.status === filters.status);
    }
    if (filters.categoryId) {
      filtered = filtered.filter(a => a.categoryId === filters.categoryId);
    }
    if (filters.tag) {
      filtered = filtered.filter(a => a.tags.includes(filters.tag!));
    }
    
    return filtered;
  }

  create(article: IArticle): void {
    this.db.articles.push(article);
  }

  update(id: string, updatedArticle: IArticle): boolean {
    const index = this.db.articles.findIndex(article => article.id === id);
    if (index === -1) return false;
    this.db.articles[index] = updatedArticle;
    return true;
  }

  delete(id: string): boolean {
    const initialLength = this.db.articles.length;
    this.db.articles = this.db.articles.filter(article => article.id !== id);
    return this.db.articles.length !== initialLength;
  }

  nullifyCategoryId(categoryId: string): number {
    let updatedCount = 0;
    this.db.articles = this.db.articles.map(article => {
      if (article.categoryId === categoryId) {
        updatedCount++;
        return { ...article, categoryId: null };
      }
      return article;
    });
    return updatedCount;
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

  getCommentsByArticleId(articleId: string) {
    return this.db.comments.filter(comment => comment.articleId === articleId);
  }
}
