import { User } from 'src/interfaces/user.interface';
import { TodoStatus } from 'src/schemas/todo.enum';

export type TodoUpdateDto = {
  title?: string;
  status?: TodoStatus;
  assigned?: boolean;
  assignedTo?: string;
  private?: boolean;
  archived?: boolean;
  id?: string;
  user: User;
};
