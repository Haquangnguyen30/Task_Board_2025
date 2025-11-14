import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  members: Types.ObjectId[];

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  color: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);