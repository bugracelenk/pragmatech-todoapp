import {
  Controller,
  Inject,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { TodoCreateDto } from 'src/dto/todo.create.dto';
import { TodoGetTodosByTeamDto } from 'src/dto/todo.get-by-team.dto';
import { TodoGetByUserDto } from 'src/dto/todo.get-by-user.dto';
import { TodoSearchDto } from 'src/dto/todo.search.dto';
import { TodoUpdateDto } from 'src/dto/todo.update.dto';
import { TodoResponse } from 'src/interfaces/todo.response';
import { ERROR_MESSAGES } from 'src/messages.enum';
import { Pattern } from 'src/patterns.enum';
import { TodoService } from '../services/todo.service';

@Controller('todos')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @MessagePattern(Pattern.CREATE_TODO)
  @UsePipes(ValidationPipe)
  async createTodo(createArgs: TodoCreateDto): Promise<TodoResponse> {
    //check is user exists
    const user = await this.userServiceClient.send(Pattern.GET_USER_BY_ID, {
      id: createArgs.createdBy,
    });

    //if not return corresponding error
    if (!user) {
      return {
        error: ERROR_MESSAGES.USER_NOT_FOUND,
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    //else create todo and return response
    const createdTodo = await this.todoService.createTodo(createArgs);
    return {
      data: { ...createdTodo },
      status: HttpStatus.ACCEPTED,
    };
  }

  @MessagePattern(Pattern.GET_TODO_WITH_ID)
  async getTodoById(args: { id: string }): Promise<TodoResponse> {
    const todo = await this.todoService.getTodoById(args.id);

    if (!todo) {
      return {
        error: ERROR_MESSAGES.TODO_NOT_FOUND,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    return {
      data: { ...todo },
      status: HttpStatus.ACCEPTED,
    };
  }

  @MessagePattern(Pattern.GET_TODOS_BY_USER)
  async getTodosByUser(args: TodoGetByUserDto): Promise<TodoResponse> {
    const todos = await this.todoService.getTodosByUser(args);

    if (!todos) {
      return {
        error: ERROR_MESSAGES.TODO_NOT_FOUND,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    return {
      data: { ...todos },
      status: HttpStatus.ACCEPTED,
    };
  }

  @MessagePattern(Pattern.GET_TODOS_BY_TEAM)
  async getTodosByTeam(args: TodoGetTodosByTeamDto): Promise<TodoResponse> {
    const todos = await this.todoService.getTodosByTeam(args);

    if (!todos) {
      return {
        error: ERROR_MESSAGES.TODO_NOT_FOUND,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    return {
      data: { ...todos },
      status: HttpStatus.ACCEPTED,
    };
  }

  @MessagePattern(Pattern.GET_TODOS_WITH_FILTER)
  async getTodosWithFilter(args: TodoSearchDto): Promise<TodoResponse> {
    const todos = await this.todoService.getTodosWithFilter(args);

    if (!todos) {
      return {
        error: ERROR_MESSAGES.TODO_NOT_FOUND,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    return {
      data: { ...todos },
      status: HttpStatus.ACCEPTED,
    };
  }

  @MessagePattern(Pattern.UPDATE_TODO)
  async updateTodo(args: TodoUpdateDto): Promise<TodoResponse> {
    const updatedTodo = await this.todoService.updateTodo(args);

    if (!updatedTodo || typeof updatedTodo.status === 'number') {
      return {
        error:
          updatedTodo.status === HttpStatus.FORBIDDEN
            ? 'FORBIDDEN'
            : ERROR_MESSAGES.TODO_UPDATE_FAILED,
        status:
          typeof updatedTodo.status === 'number'
            ? updatedTodo.status
            : HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    return {
      data: { ...updatedTodo },
      status: HttpStatus.ACCEPTED,
    };
  }

  @MessagePattern(Pattern.DELETE_TODO)
  async deleteTodo(deleteArgs: {
    todoId: string;
    userId: string;
  }): Promise<TodoResponse> {
    const { todoId, userId } = deleteArgs;
    const deletedTodo = await this.todoService.deleteTodo(todoId, userId);

    const { status } = deletedTodo;
    if (!deletedTodo || typeof status === 'number') {
      return {
        error:
          status === HttpStatus.FORBIDDEN
            ? 'FORBIDDEN'
            : ERROR_MESSAGES.TODO_NOT_FOUND,
        status:
          typeof status === 'number'
            ? status
            : HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    return {
      data: null,
      status: HttpStatus.ACCEPTED,
    };
  }
}
