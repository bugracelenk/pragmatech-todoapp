import { Controller, Inject, HttpStatus } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { TodoCreateDto } from 'src/dto/todo.create.dto';
import { TodoGetTodosByTeamDto } from 'src/dto/todo.get-by-team.dto';
import { TodoGetByUserDto } from 'src/dto/todo.get-by-user.dto';
import { TodoSearchDto } from 'src/dto/todo.search.dto';
import { TodoUpdateDto } from 'src/dto/todo.update.dto';
import { sendAck } from 'src/helpers/sendAck';
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
  async createTodo(
    @Payload() createArgs: TodoCreateDto,
    @Ctx() context: RmqContext,
  ): Promise<TodoResponse> {
    try {
      let data: TodoResponse;
      //check is user exists
      const user = await this.userServiceClient.send(Pattern.GET_USER_BY_ID, {
        id: createArgs.createdBy,
      });

      //if not return corresponding error
      if (!user) {
        data = {
          error: ERROR_MESSAGES.USER_NOT_FOUND,
          data: null,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }

      //else create todo and return response
      const createdTodo = await this.todoService.createTodo(createArgs);
      data = {
        data: createdTodo,
        status: HttpStatus.ACCEPTED,
      };

      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        error: error.message,
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @MessagePattern(Pattern.GET_TODO_WITH_ID)
  async getTodoById(
    @Payload() args: { id: string },
    @Ctx() context: RmqContext,
  ): Promise<TodoResponse> {
    try {
      const todo = await this.todoService.getTodoById(args.id);
      let data: TodoResponse;
      if (!todo) {
        data = {
          error: ERROR_MESSAGES.TODO_NOT_FOUND,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: null,
        };
      }

      data = {
        data: todo,
        status: HttpStatus.ACCEPTED,
      };

      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        error: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  @MessagePattern(Pattern.GET_TODOS_BY_USER)
  async getTodosByUser(
    @Payload() args: TodoGetByUserDto,
    @Ctx() context: RmqContext,
  ): Promise<TodoResponse> {
    try {
      let data: TodoResponse;
      const todos = await this.todoService.getTodosByUser(args);

      if (!todos) {
        data = {
          error: ERROR_MESSAGES.TODO_NOT_FOUND,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: null,
        };
      }

      data = {
        data: todos,
        status: HttpStatus.ACCEPTED,
      };

      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        error: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  @MessagePattern(Pattern.GET_TODOS_BY_TEAM)
  async getTodosByTeam(
    @Payload() args: TodoGetTodosByTeamDto,
    @Ctx() context: RmqContext,
  ): Promise<TodoResponse> {
    try {
      let data: TodoResponse;
      const todos = await this.todoService.getTodosByTeam(args);

      if (!todos) {
        data = {
          error: ERROR_MESSAGES.TODO_NOT_FOUND,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: null,
        };
      }

      data = {
        data: todos,
        status: HttpStatus.ACCEPTED,
      };
      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        error: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  @MessagePattern(Pattern.GET_TODOS_WITH_FILTER)
  async getTodosWithFilter(
    @Payload() args: TodoSearchDto,
    @Ctx() context: RmqContext,
  ): Promise<TodoResponse> {
    try {
      let data: TodoResponse;
      const todos = await this.todoService.getTodosWithFilter(args);

      if (!todos) {
        data = {
          error: ERROR_MESSAGES.TODO_NOT_FOUND,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: null,
        };
      }

      data = {
        data: todos,
        status: HttpStatus.ACCEPTED,
      };
      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        error: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  @MessagePattern(Pattern.UPDATE_TODO)
  async updateTodo(
    @Payload() args: TodoUpdateDto,
    @Ctx() context: RmqContext,
  ): Promise<TodoResponse> {
    try {
      let data: TodoResponse;
      const updatedTodo = await this.todoService.updateTodo(args);

      if (!updatedTodo || typeof updatedTodo.status === 'number') {
        data = {
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

      data = {
        data: updatedTodo,
        status: HttpStatus.ACCEPTED,
      };
      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        error: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  @MessagePattern(Pattern.DELETE_TODO)
  async deleteTodo(
    @Payload()
    deleteArgs: {
      todoId: string;
      userId: string;
    },
    @Ctx() context: RmqContext,
  ): Promise<TodoResponse> {
    try {
      let data: TodoResponse;
      const { todoId, userId } = deleteArgs;
      const deletedTodo = await this.todoService.deleteTodo(todoId, userId);

      const { status } = deletedTodo;
      if (!deletedTodo || typeof status === 'number') {
        data = {
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

      data = {
        data: null,
        status: HttpStatus.ACCEPTED,
      };

      console.log(data);
      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        error: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }
}
