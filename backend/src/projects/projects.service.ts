import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from './project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const project = new this.projectModel({
      ...createProjectDto,
      ownerId: new Types.ObjectId(userId),
      members: [new Types.ObjectId(userId), ...(createProjectDto.members || []).map(id => new Types.ObjectId(id))],
    });
    return project.save();
  }

  async findAll(userId: string): Promise<Project[]> {
    return this.projectModel
      .find({
        $or: [
          { ownerId: new Types.ObjectId(userId) },
          { members: new Types.ObjectId(userId) }
        ]
      })
      .populate('ownerId', 'name email')
      .populate('members', 'name email')
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.projectModel
      .findOne({
        _id: new Types.ObjectId(id),
        $or: [
          { ownerId: new Types.ObjectId(userId) },
          { members: new Types.ObjectId(userId) }
        ]
      })
      .populate('ownerId', 'name email')
      .populate('members', 'name email')
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found or access denied');
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<Project> {
    const project = await this.projectModel.findOne({
      _id: new Types.ObjectId(id),
      ownerId: new Types.ObjectId(userId)
    }).exec();

    if (!project) {
      throw new ForbiddenException('Only project owner can update the project');
    }

    if (updateProjectDto.members) {
      updateProjectDto.members = [
        new Types.ObjectId(userId),
        ...updateProjectDto.members.map(id => new Types.ObjectId(id))
      ];
    }

    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .populate('ownerId', 'name email')
      .populate('members', 'name email')
      .exec();

    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }
    return updatedProject;
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.projectModel.findOne({
      _id: new Types.ObjectId(id),
      ownerId: new Types.ObjectId(userId)
    }).exec();

    if (!project) {
      throw new ForbiddenException('Only project owner can delete the project');
    }

    const result = await this.projectModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Project not found');
    }
  }
}