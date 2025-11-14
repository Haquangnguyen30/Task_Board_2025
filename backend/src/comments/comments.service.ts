import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = new this.commentModel({
      ...createCommentDto,
      userId: new Types.ObjectId(userId),
      taskId: new Types.ObjectId(createCommentDto.taskId),
      parentId: createCommentDto.parentId
        ? new Types.ObjectId(createCommentDto.parentId)
        : null,
    });
    return comment.save();
  }

  async findAllByTask(taskId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ taskId: new Types.ObjectId(taskId) })
      .populate('userId', 'name email')
      .populate('parentId')
      .sort({ createdAt: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel
      .findById(id)
      .populate('userId', 'name email')
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.commentModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment not found or access denied');
    }

    await this.commentModel.findByIdAndDelete(id).exec();
  }
}
