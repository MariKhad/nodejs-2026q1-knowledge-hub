import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/CreateArticleDto';
import { UpdateArticleDto } from './dto/UpdateArticleDto';
import { UuidValidationPipe } from '../common/pipes/uuid.pipe';
import { EArticleStatus } from './enums/EArticleStatus';

@ApiTags('Articles')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Returns all articles' })
  @ApiQuery({ name: 'status', required: false, enum: EArticleStatus })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'tag', required: false, type: String })
  findAll(
    @Query('status') status?: EArticleStatus,
    @Query('categoryId') categoryId?: string,
    @Query('tag') tag?: string,
  ) {
    return this.articleService.findAll(status, categoryId, tag);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by id' })
  @ApiParam({ name: 'id', description: 'Article UUID' })
  @ApiResponse({ status: 200, description: 'Returns article' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.articleService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or author/category not found' })
  @ApiBody({ type: CreateArticleDto })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update article' })
  @ApiParam({ name: 'id', description: 'Article UUID' })
  @ApiResponse({ status: 200, description: 'Article updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID or input' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @ApiBody({ type: UpdateArticleDto })
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete article' })
  @ApiParam({ name: 'id', description: 'Article UUID' })
  @ApiResponse({ status: 204, description: 'Article deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  remove(@Param('id', UuidValidationPipe) id: string) {
    this.articleService.delete(id);
  }
}