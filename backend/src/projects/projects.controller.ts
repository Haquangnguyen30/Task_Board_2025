import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req): Promise<Project> {
    return this.projectsService.create(createProjectDto, req.user._id);
  }

  @Get()
  async findAll(@Request() req): Promise<Project[]> {
    return this.projectsService.findAll(req.user._id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<Project> {
    return this.projectsService.findOne(id, req.user._id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req): Promise<Project> {
    return this.projectsService.update(id, updateProjectDto, req.user._id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.projectsService.remove(id, req.user._id);
  }
}