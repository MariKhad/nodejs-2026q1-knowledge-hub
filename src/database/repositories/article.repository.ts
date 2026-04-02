import { IArticle } from "src/article/interfaces/IArticle";
import { Database } from "../db.interface";

export class ArticleRepository {
  private data: Database;

  constructor(data: Database) {
    this.data = data;
  }

  findAll(): IArticle[] {
    return this.data.articles;
  }

  findById(id: string): IArticle | undefined {
    return this.data.articles.find(article => article.id === id);
  }

  findByFilters(filters: { status?: string; categoryId?: string; tag?: string }): IArticle[] {
    let filtered = [...this.data.articles];
    
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
    this.data.articles.push(article);
  }

  update(id: string, updatedArticle: IArticle): boolean {
    const index = this.data.articles.findIndex(article => article.id === id);
    if (index === -1) return false;
    this.data.articles[index] = updatedArticle;
    return true;
  }

  delete(id: string): boolean {
    const initialLength = this.data.articles.length;
    this.data.articles = this.data.articles.filter(article => article.id !== id);
    return this.data.articles.length !== initialLength;
  }

  nullifyCategoryId(categoryId: string): number {
    let updatedCount = 0;
    this.data.articles = this.data.articles.map(article => {
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
    this.data.articles = this.data.articles.map(article => {
      if (article.authorId === authorId) {
        updatedCount++;
        return { ...article, authorId: null };
      }
      return article;
    });
    return updatedCount;
  }

  getCommentsByArticleId(articleId: string) {
    return this.data.comments.filter(comment => comment.articleId === articleId);
  }
}
