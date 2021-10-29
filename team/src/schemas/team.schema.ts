import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ITodo } from 'src/interfaces/todo.interface';
import { IUser } from 'src/interfaces/user.interface';
import * as mongoose from 'mongoose';
import { TeamStatus } from './team.enum';

/**
 * Team Model:
 * name: string;
 * leader: User | string | mongosoe.Schema.Types.ObjectId,
 * createdBy: User | string | mongosoe.Schema.Types.ObjectId,
 * moderators: [User],
 * members: [User],
 * todos: [Todo],
 * teamStatus: TeamStatus
 */

export type TeamDocument = Team & mongoose.Document;

@Schema({ timestamps: true })
export class Team {
  id: string;

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 20,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  })
  leader: IUser | string | mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  })
  createdBy: IUser | string | mongoose.Schema.Types.ObjectId;

  @Prop({
    default: [],
  })
  moderators: [IUser | string | mongoose.Schema.Types.ObjectId];

  @Prop({
    default: [],
  })
  members: [IUser | string | mongoose.Schema.Types.ObjectId];

  @Prop({
    default: [],
  })
  todos: [ITodo | string | mongoose.Schema.Types.ObjectId];

  @Prop({
    default: 'ACTIVE',
    enum: TeamStatus,
  })
  teamStatus: TeamStatus;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
