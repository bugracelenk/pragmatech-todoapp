import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Team {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  leader: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
