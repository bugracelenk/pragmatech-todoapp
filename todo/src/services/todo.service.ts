import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TodoCreateDto } from 'src/dto/todo.create.dto';
import { TodoGetTodosByTeamDto } from 'src/dto/todo.get-by-team.dto';
import { TodoGetByUserDto } from 'src/dto/todo.get-by-user.dto';
import { TodoSearchDto } from 'src/dto/todo.search.dto';
import { TodoUpdateDto } from 'src/dto/todo.update.dto';
import { havePermission } from 'src/helpers/checkPermission';
import { Pattern } from 'src/patterns.enum';
import { TeamResponse } from 'src/responses/team.response';
import { UserResponse } from 'src/responses/user.response';
import { TodoRepository } from '../repositories/todo.repository';
import { Todo } from '../schemas/todo.schema';

@Injectable()
export class TodoService {
  constructor(
    private readonly todoRepository: TodoRepository,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('TEAM_SERVICE') private readonly teamServiceClient: ClientProxy,
  ) {}

  async createTodo(
    createArgs: TodoCreateDto,
  ): Promise<Todo | { error?: string }> {
    if (createArgs.team && createArgs.private) {
      delete createArgs.team;
    }
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

    if (createArgs.team) {
      const updatedTeam = await this.teamServiceClient.send<TeamResponse>(
        Pattern.ADD_TEAM_TODO,
        {
          todoId: todo.id,
          teamId: todo.team,
          operatingUserId: createArgs.createdBy,
        },
      );
      const teamData = await lastValueFrom(updatedTeam);

      if (
        teamData.status === HttpStatus.INTERNAL_SERVER_ERROR ||
        teamData.status === HttpStatus.NOT_FOUND
      ) {
        await this.todoRepository.deleteTodo(todo.id);
        return {
          error: teamData.error,
        };
      }
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

  async updateTodo(
    updateArgs: TodoUpdateDto,
  ): Promise<Todo | { error?: string; status: number }> {
    const todoId = updateArgs.id;
    delete updateArgs.id;
    const todo = await this.todoRepository.getTodoById(todoId);
    const { user } = updateArgs;
    delete updateArgs.user;
    if (!havePermission({ todo, user, requiredRole: 'ADMIN' })) {
      return { error: 'FORBIDDEN', status: HttpStatus.FORBIDDEN };
    }
    return await this.todoRepository.updateTodoById(todoId, updateArgs);
  }

  async deleteTodo(
    todoId: string,
    userId: string,
  ): Promise<Todo | { error?: string; status: number }> {
    const todo = await this.todoRepository.getTodoById(todoId);

    const userClientResponse = await this.userServiceClient.send<UserResponse>(
      Pattern.GET_USER_BY_ID,
      {
        id: userId,
      },
    );
    const userData = await lastValueFrom(userClientResponse);
    //user not found or microservice internal error
    if (userData.error) {
      return {
        error: userData.error,
        status: userData.status,
      };
    }
    //check permission for user
    if (
      typeof userData.user !== 'string' &&
      !havePermission({ todo, user: userData.user, requiredRole: 'ADMIN' })
    ) {
      return { error: 'FORBIDDEN', status: HttpStatus.FORBIDDEN };
    }

    const deleteUserTodoResponse =
      await this.userServiceClient.send<UserResponse>(
        Pattern.REMOVE_USER_TODO,
        { userId, todoId },
      );

    const deleteUserTodoData = await lastValueFrom(deleteUserTodoResponse);
    //todo couldn't removed from user
    if (deleteUserTodoData.error) {
      return {
        error: deleteUserTodoData.error,
        status: deleteUserTodoData.status,
      };
    }

    //check if todo related to a team
    if (todo.team) {
      const deleteTeamTodoResponse =
        await this.teamServiceClient.send<TeamResponse>(
          Pattern.REMOVE_TEAM_TODO,
          {
            todoId: todo.id,
            teamId: todo.team,
            operatingUserId: userId,
          },
        );

      const deleteTeamTodoData = await lastValueFrom(deleteTeamTodoResponse);

      if (deleteTeamTodoData.error) {
        return {
          error: deleteTeamTodoData.error,
          status: deleteTeamTodoData.status,
        };
      }
    }
    return await this.todoRepository.deleteTodo(todoId);
  }
}
