import { IsString, IsOptional, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  members?: Types.ObjectId[];

  @IsString()
  @IsOptional()
  color?: string;
}