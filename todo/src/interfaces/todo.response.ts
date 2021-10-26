import { Todo } from 'src/schemas/todo.schema';

export interface TodoResponse {
  data: Todo | Todo[] | null;
  status: number;
  error?: string;
}
