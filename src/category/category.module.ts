import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from '../database/repositories/category.repository';
import { databaseProvider } from 'src/database/db.provider';
import { ArticleModule } from 'src/article/article.module';


@Module({
    imports: [    
      forwardRef(() => ArticleModule),
    ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, databaseProvider],
  exports: [CategoryService],
})
export class CategoryModule {}