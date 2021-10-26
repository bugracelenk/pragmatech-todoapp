import { TodoStatus } from 'src/schemas/todo.enum';

export type TodoSearchDto = {
  title?: string;
  team?: string;
  createdBy?: string;
  status?: TodoStatus;
  archived?: boolean;
  assignedTo?: string;
  assigned?: boolean;
  perPage?: string;
  page?: string;
};
