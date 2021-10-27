import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TodoCreateDto } from 'src/dto/todo.create.dto';
import { TodoGetTodosByTeamDto } from 'src/dto/todo.get-by-team.dto';
import { TodoGetByUserDto } from 'src/dto/todo.get-by-user.dto';
import { TodoSearchDto } from 'src/dto/todo.search.dto';
import { TodoUpdateDto } from 'src/dto/todo.update.dto';
import { Pattern } from 'src/patterns.enum';
import { UserResponse } from 'src/responses/user.response';
import { TodoRepository } from '../repositories/todo.repository';
import { Todo } from '../schemas/todo.schema';

@Injectable()
export class TodoService {
  constructor(
    private readonly todoRepository: TodoRepository,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async createTodo(
    createArgs: TodoCreateDto,
  ): Promise<Todo | { error?: string }> {
    const todo = await this.todoRepository.createTodo(createArgs);
    const updatedUser = await this.userServiceClient.send<UserResponse>(
      Pattern.ADD_USER_TODO,
      {
        userId: createArgs.createdBy,
        todoId: todo.id,
      },
    );

    const userData = await lastValueFrom(updatedUser);

    if (userData.status === HttpStatus.INTERNAL_SERVER_ERROR) {
      await this.todoRepository.deleteTodo(todo.id);
      return {
        error: 'USER_TODO_ADD_ERROR',
      };
    }

    return todo;
  }

  async getTodoById(id: string): Promise<Todo> {
    return await this.todoRepository.getTodoById(id);
  }

  async getTodosByUser(getByUserArgs: TodoGetByUserDto): Promise<Todo[]> {
    const { userId, perPage, page } = getByUserArgs;
    return await this.todoRepository.getTodosByUser(userId, perPage, page);
  }

  async getTodosByTeam(getByTeamArgs: TodoGetTodosByTeamDto): Promise<Todo[]> {
    const { teamId, perPage, page } = getByTeamArgs;
    return await this.todoRepository.getTodosByTeam(teamId, perPage, page);
  }

  async getTodosWithFilter(todoSearchArgs: TodoSearchDto): Promise<Todo[]> {
    const perPage = todoSearchArgs.perPage;
    const page = todoSearchArgs.page;

    delete todoSearchArgs.perPage;
    delete todoSearchArgs.page;

    return await this.todoRepository.getTodoWithFilter(
      todoSearchArgs,
      perPage,
      page,
    );
  }

  async updateTodo(updateArgs: TodoUpdateDto): Promise<Todo> {
    const todoId = updateArgs.id;
    delete updateArgs.id;
    return await this.todoRepository.updateTodoById(todoId, updateArgs);
  }

  async deleteTodo(todoId: string): Promise<Todo> {
    return await this.todoRepository.deleteTodo(todoId);
  }
}
