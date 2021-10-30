import { Todo } from 'src/schemas/todo.schema';
import { IUser } from './user.interface';

export interface Team {
  id: string;
  leader: string;
  createdBy: string;
  members: [IUser | string];
  todos: [Todo | string];
  teamStatus: string;
}
