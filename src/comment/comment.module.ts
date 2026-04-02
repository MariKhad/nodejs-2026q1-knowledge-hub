import { forwardRef, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from '../database/repositories/comment.repository';
import { ArticleModule } from '../article/article.module';
import { UserModule } from '../user/user.module'; 
import { databaseProvider } from 'src/database/db.provider';
import { ArticleRepository } from 'src/database/repositories/article.repository';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [ArticleModule, UserModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, ArticleRepository, UserService, databaseProvider],
  exports: [CommentService],
})
export class CommentModule {}