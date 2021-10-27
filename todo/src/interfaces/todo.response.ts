import { Todo } from 'src/schemas/todo.schema';

export interface TodoResponse {
  data: Todo | Todo[] | null | { error?: string };
  status: number;
  error?: string;
}
