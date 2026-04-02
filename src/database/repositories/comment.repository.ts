import { IComment } from "src/comment/interfaces/IComment";
import { Database } from "../db.interface";
import { DATABASE_CONNECTION } from "../db.provider";
import { Inject } from "@nestjs/common";


export class CommentRepository {
constructor(@Inject(DATABASE_CONNECTION) private db: Database) {}

  findByArticleId(articleId: string): IComment[] {
    return this.db.comments.filter(comment => comment.articleId === articleId);
  }

  findByAuthorId(authorId: string): IComment[] {
    return this.db.comments.filter(comment => comment.authorId === authorId);
  }

  findById(id: string): IComment | undefined {
    return this.db.comments.find(comment => comment.id === id);
  }

  create(comment: IComment): void {
    this.db.comments.push(comment);
  }

  update(id: string, updatedComment: IComment): boolean {
    const index = this.db.comments.findIndex(comment => comment.id === id);
    if (index === -1) return false;
    this.db.comments[index] = updatedComment;
    return true;
  }

  delete(id: string): boolean {
    const initialLength = this.db.comments.length;
    this.db.comments = this.db.comments.filter(comment => comment.id !== id);
    return this.db.comments.length !== initialLength;
  }

  deleteByAuthorId(authorId: string): number {
    const initialLength = this.db.comments.length;
    this.db.comments = this.db.comments.filter(comment => comment.authorId !== authorId);
    return initialLength - this.db.comments.length;
  }

  deleteByArticleId(articleId: string): number {
    const initialLength = this.db.comments.length;
    this.db.comments = this.db.comments.filter(comment => comment.articleId !== articleId);
    return initialLength - this.db.comments.length;
  }
}
