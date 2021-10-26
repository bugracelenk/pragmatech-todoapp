import { Injectable } from '@nestjs/common';
import { TodoCreateDto } from 'src/dto/todo.create.dto';
import { TodoGetTodosByTeamDto } from 'src/dto/todo.get-by-team.dto';
import { TodoGetByUserDto } from 'src/dto/todo.get-by-user.dto';
import { TodoSearchDto } from 'src/dto/todo.search.dto';
import { TodoUpdateDto } from 'src/dto/todo.update.dto';
import { TodoRepository } from '../repositories/todo.repository';
import { Todo } from '../schemas/todo.schema';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async createTodo(createArgs: TodoCreateDto): Promise<Todo> {
    return await this.todoRepository.createTodo(createArgs);
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
