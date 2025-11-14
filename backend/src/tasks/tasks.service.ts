import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from './task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    // Get the highest position in the current status column
    const lastTask = await this.taskModel
      .findOne({
        projectId: createTaskDto.projectId,
        status: createTaskDto.status || 'todo',
      })
      .sort({ position: -1 })
      .exec();

    const position = lastTask ? lastTask.position + 1 : 0;

    const task = new this.taskModel({
      ...createTaskDto,
      createdBy: new Types.ObjectId(userId),
      projectId: new Types.ObjectId(createTaskDto.projectId),
      assigneeId: createTaskDto.assigneeId
        ? new Types.ObjectId(createTaskDto.assigneeId)
        : null,
      position,
    });

    return task.save();
  }

  async findAllByProject(projectId: string, userId: string): Promise<Task[]> {
    return this.taskModel
      .find({ projectId: new Types.ObjectId(projectId) })
      .populate('assigneeId', 'name email')
      .populate('createdBy', 'name email')
      .sort({ position: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel
      .findById(id)
      .populate('assigneeId', 'name email')
      .populate('createdBy', 'name email')
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .populate('assigneeId', 'name email')
      .populate('createdBy', 'name email')
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async updatePosition(
    taskId: string,
    status: string,
    position: number,
  ): Promise<Task> {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Update other tasks' positions
    if (task.status !== status) {
      // Moving to different column
      await this.taskModel.updateMany(
        {
          projectId: task.projectId,
          status: task.status,
          position: { $gt: task.position },
        },
        { $inc: { position: -1 } },
      );

      await this.taskModel.updateMany(
        {
          projectId: task.projectId,
          status: status,
          position: { $gte: position },
        },
        { $inc: { position: 1 } },
      );
    } else {
      // Moving within same column
      if (task.position < position) {
        await this.taskModel.updateMany(
          {
            projectId: task.projectId,
            status: status,
            position: { $gt: task.position, $lte: position },
          },
          { $inc: { position: -1 } },
        );
      } else {
        await this.taskModel.updateMany(
          {
            projectId: task.projectId,
            status: status,
            position: { $lt: task.position, $gte: position },
          },
          { $inc: { position: 1 } },
        );
      }
    }

    task.status = status;
    task.position = position;
    return task.save();
  }

  async remove(id: string): Promise<void> {
    const task = await this.taskModel.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Update positions of other tasks in the same column
    await this.taskModel.updateMany(
      {
        projectId: task.projectId,
        status: task.status,
        position: { $gt: task.position },
      },
      { $inc: { position: -1 } },
    );

    await this.taskModel.findByIdAndDelete(id).exec();
  }
}
