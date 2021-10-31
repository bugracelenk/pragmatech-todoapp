import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { TeamStatus } from './team.enum';
import { Todo } from './todo.schema';
import { User } from './user.schema';

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
    ref: 'User',
  })
  leader: User | string | mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: User | string | mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  })
  moderators: [User | string | mongoose.Schema.Types.ObjectId];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  })
  members: [User | string | mongoose.Schema.Types.ObjectId];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo',
    default: [],
  })
  todos: [Todo | string | mongoose.Schema.Types.ObjectId];

  @Prop({
    default: 'ACTIVE',
    enum: TeamStatus,
  })
  teamStatus: TeamStatus;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
