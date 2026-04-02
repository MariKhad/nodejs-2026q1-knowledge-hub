import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { databaseProvider } from './database/db.provider';

@Module({
  imports: [ArticleModule, UserModule, CategoryModule, CommentModule],
  controllers: [AppController],
  providers: [AppService, databaseProvider],
  exports: [databaseProvider],
})
export class AppModule {}
