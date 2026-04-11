import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from '../database/repositories/users.repository';
import { ArticleModule } from '../article/article.module';
import { CommentModule } from '../comment/comment.module';
import { databaseProvider } from 'src/database/db.provider';

@Module({
  imports:[forwardRef(() => ArticleModule), forwardRef(() => CommentModule)],
  controllers: [UserController],
  providers: [UserService, UserRepository, databaseProvider],
  exports: [UserService, UserRepository],
})
export class UserModule {}