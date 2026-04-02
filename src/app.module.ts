import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { CommentModule } from './comment/comment.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';

@Module({
  imports: [ArticleModule, UserModule, CategoryModule, CommentModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
