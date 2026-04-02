import { Controller, Get, Post, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/CreateCommentDto';
import { ParseUUIDPipe } from '@nestjs/common';
import { UuidValidationPipe } from 'src/common/pipes/uuid.pipe';

@ApiTags('Comments')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Get()
  @ApiOperation({ summary: 'Get all comments for an article' })
  @ApiQuery({ name: 'articleId', required: true, description: 'Article UUID' })
  @ApiResponse({ status: 200, description: 'Returns comments for the article' })
  @ApiResponse({ status: 400, description: 'articleId query parameter is required' })
  findByArticleId(@Query('articleId', ParseUUIDPipe) articleId: string) {
    return this.commentService.findByArticleId(articleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by id' })
  @ApiParam({ name: 'id', description: 'Comment UUID' })
  @ApiResponse({ status: 200, description: 'Returns comment' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.commentService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 422, description: 'Article does not exist' })
  @ApiBody({ type: CreateCommentDto })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete comment' })
  @ApiParam({ name: 'id', description: 'Comment UUID' })
  @ApiResponse({ status: 204, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  remove(@Param('id', UuidValidationPipe) id: string) {
    this.commentService.delete(id);
  }
}