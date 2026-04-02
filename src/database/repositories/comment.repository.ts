import { IComment } from "src/comment/interfaces/IComment";
import { Database } from "../db.interface";


class CommentRepository {
  private data: Database;

  constructor(data: Database) {
    this.data = data;
  }

  findByArticleId(articleId: string): IComment[] {
    return this.data.comments.filter(comment => comment.articleId === articleId);
  }

  findByAuthorId(authorId: string): IComment[] {
    return this.data.comments.filter(comment => comment.authorId === authorId);
  }

  findById(id: string): IComment | undefined {
    return this.data.comments.find(comment => comment.id === id);
  }

  create(comment: IComment): void {
    this.data.comments.push(comment);
  }

  update(id: string, updatedComment: IComment): boolean {
    const index = this.data.comments.findIndex(comment => comment.id === id);
    if (index === -1) return false;
    this.data.comments[index] = updatedComment;
    return true;
  }

  delete(id: string): boolean {
    const initialLength = this.data.comments.length;
    this.data.comments = this.data.comments.filter(comment => comment.id !== id);
    return this.data.comments.length !== initialLength;
  }

  deleteByAuthorId(authorId: string): number {
    const initialLength = this.data.comments.length;
    this.data.comments = this.data.comments.filter(comment => comment.authorId !== authorId);
    return initialLength - this.data.comments.length;
  }

  deleteByArticleId(articleId: string): number {
    const initialLength = this.data.comments.length;
    this.data.comments = this.data.comments.filter(comment => comment.articleId !== articleId);
    return initialLength - this.data.comments.length;
  }
}

export const commentRepository = (data: Database) => new CommentRepository(data);