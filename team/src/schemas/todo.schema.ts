import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Todo {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
