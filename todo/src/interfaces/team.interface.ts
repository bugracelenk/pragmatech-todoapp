import { Todo } from 'src/schemas/todo.schema';
import { User } from './user.interface';

export interface Team {
  id: string;
  leader: string;
  createdBy: string;
  members: [User | string];
  todos: [Todo | string];
  teamStatus: string;
}
