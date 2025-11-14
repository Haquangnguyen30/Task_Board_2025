import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ): Promise<Comment> {
    return this.commentsService.create(createCommentDto, req.user._id);
  }

  @Get('task/:taskId')
  async findAllByTask(@Param('taskId') taskId: string): Promise<Comment[]> {
    return this.commentsService.findAllByTask(taskId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.commentsService.remove(id, req.user._id);
  }
}
