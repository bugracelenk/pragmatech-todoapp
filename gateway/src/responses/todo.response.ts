import { ApiProperty } from '@nestjs/swagger';
import { ITodo } from '../interfaces/todo.interface';

class DefaultResponse {
  @ApiProperty({
    example: 'Success',
    description: 'Message returned from microservice',
    required: false,
  })
  message?: string;

  @ApiProperty({
    example: 200,
    description: 'Status code returned from microservice',
    required: false,
  })
  status?: number;

  @ApiProperty({
    example: 'User update failed!',
    description: 'Error code returned from microservice',
    required: false,
  })
  error?: string;
}

export class TodoResponse extends DefaultResponse {
  data: ITodo | ITodo[] | null | { error?: string };
}
