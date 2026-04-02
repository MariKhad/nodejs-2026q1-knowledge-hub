import { PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './CreateCommentDto';



export class UpdateCommentDto extends PartialType(CreateCommentDto) {}