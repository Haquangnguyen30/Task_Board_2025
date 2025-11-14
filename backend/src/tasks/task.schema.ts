import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: 'todo' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assigneeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ default: 'medium' })
  priority: string;

  @Prop()
  dueDate: Date;

  @Prop({ default: 0 })
  position: number;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  tags: string[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);