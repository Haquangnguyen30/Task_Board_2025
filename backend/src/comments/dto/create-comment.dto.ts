import { IsString, IsMongoId, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsMongoId()
  taskId: string;

  @IsMongoId()
  @IsOptional()
  parentId?: string;
}
