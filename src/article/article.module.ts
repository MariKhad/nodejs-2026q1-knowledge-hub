import { forwardRef, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ArticleRepository } from '../database/repositories/article.repository';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { CommentModule } from '../comment/comment.module';
import { databaseProvider } from 'src/database/db.provider';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';
import { CommentService } from 'src/comment/comment.service';

@Module({
  imports: [    
    forwardRef(() => UserModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => CommentModule),],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository, databaseProvider],
  exports: [ArticleService],
})
export class ArticleModule {}