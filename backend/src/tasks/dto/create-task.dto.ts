import { IsString, IsOptional, IsDateString, IsMongoId, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  projectId: string;

  @IsMongoId()
  @IsOptional()
  assigneeId?: string;

  @IsIn(['low', 'medium', 'high', 'critical'])
  @IsOptional()
  priority?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsOptional()
  tags?: string[];
}