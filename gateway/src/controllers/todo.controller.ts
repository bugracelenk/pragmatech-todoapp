import {
  Controller,
  Inject,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  Post,
  InternalServerErrorException,
  UseGuards,
  HttpStatus,
  Get,
  Patch,
  Req,
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';
import { UserStatus, UserStatuses } from 'src/decorators/status.decorator';
import {
  TodoCreateDto,
  TodoGetTodosByTeamDto,
  TodoGetTodosByUserDto,
  TodoSearchDto,
  TodoUpdateDto,
} from 'src/dto/todo.dto';
import { ActiveStatusGuard } from 'src/guards/active.user.guard';
import { JwtGuard } from 'src/guards/jwt.guard';
import { IUserFromRequest } from 'src/interfaces/user.interface';
import { Pattern } from 'src/patterns.enum';
import { TodoResponse } from 'src/responses/todo.response';

@ApiTags('Todo')
@Controller('todo')
export class TodoController {
  constructor(
    @Inject('TODO_SERVICE') private readonly todoServiceClient: ClientProxy,
  ) {}

  @Post('create')
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Creates new todo',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Todo created successfully',
    type: TodoResponse,
  })
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  async createTodo(
    @Body() createTodoDto: TodoCreateDto,
    @Req() request: IUserFromRequest,
  ) {
    const createTodoResponse = await this.todoServiceClient.send<TodoResponse>(
      Pattern.TODO_CREATE_TODO,
      {
        createdBy: request.user.id,
        ...createTodoDto,
      },
    );

    const createdTodoData = await lastValueFrom(createTodoResponse);

    if (createdTodoData.error || createdTodoData.data === null) {
      throw new InternalServerErrorException(createdTodoData.error);
    }

    return {
      ...createdTodoData,
    };
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Gets todo with the given id',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Todo retrieved',
    type: TodoResponse,
  })
  @UsePipes(ValidationPipe)
  async getTodoWithId(@Param('id') id: string) {
    const getTodoResponse = await this.todoServiceClient.send<TodoResponse>(
      Pattern.TODO_GET_TODO_WITH_ID,
      {
        id,
      },
    );

    const getTodoData = await lastValueFrom(getTodoResponse);

    if (getTodoData.error || getTodoData.data === null) {
      throw new InternalServerErrorException(getTodoData.error);
    }

    return {
      ...getTodoData,
    };
  }

  @Get('/user')
  @ApiOperation({
    summary: 'Gets todos for the user with the given user id',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Todos retrieved',
    type: TodoResponse,
  })
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  async getTodoByUser(@Query() getTodosByUserDto: TodoGetTodosByUserDto) {
    const getTodoResponse = await this.todoServiceClient.send<TodoResponse>(
      Pattern.TODO_GET_TODOS_BY_USER,
      {
        ...getTodosByUserDto,
      },
    );

    const getTodoData = await lastValueFrom(getTodoResponse);

    if (getTodoData.error || getTodoData.data === null) {
      throw new InternalServerErrorException(getTodoData.error);
    }

    return {
      ...getTodoData,
    };
  }

  @Get('/team')
  @ApiOperation({
    summary: 'Gets todos for the team with the given team id',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Todos retrieved',
    type: TodoResponse,
  })
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  async getTodoByTeam(@Query() getTodosByTeamDto: TodoGetTodosByTeamDto) {
    const getTodoResponse = await this.todoServiceClient.send<TodoResponse>(
      Pattern.TODO_GET_TODOS_BY_TEAM,
      {
        ...getTodosByTeamDto,
      },
    );

    const getTodoData = await lastValueFrom(getTodoResponse);

    if (getTodoData.error || getTodoData.data === null) {
      throw new InternalServerErrorException(getTodoData.error);
    }

    return {
      ...getTodoData,
    };
  }

  @Get('/search')
  @ApiOperation({
    summary: 'Searches todos with the given paramaters',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Todos retrieved',
    type: TodoResponse,
  })
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  async getTodosWithFilter(@Query() todoSearchDto: TodoSearchDto) {
    const getTodoResponse = await this.todoServiceClient.send<TodoResponse>(
      Pattern.TODO_GET_TODOS_BY_TEAM,
      {
        ...todoSearchDto,
      },
    );

    const getTodoData = await lastValueFrom(getTodoResponse);

    if (getTodoData.error || getTodoData.data === null) {
      throw new InternalServerErrorException(getTodoData.error);
    }

    return {
      ...getTodoData,
    };
  }

  @Patch('/update/:id')
  @ApiOperation({
    summary: 'Updates the todo with the given id',
    description:
      'Todo microservice checks if user have permission to do the operation',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Todo updated',
    type: TodoResponse,
  })
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  async updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: TodoUpdateDto,
    @Req() request: IUserFromRequest,
  ) {
    const { user } = request;
    const updateTodoResponse = await this.todoServiceClient.send<TodoResponse>(
      Pattern.TODO_UPDATE_TODO,
      {
        id,
        user,
        ...updateTodoDto,
      },
    );

    const updatedTodoData = await lastValueFrom(updateTodoResponse);

    if (updatedTodoData.error || updatedTodoData.data === null) {
      throw new InternalServerErrorException(updatedTodoData.error);
    }

    return {
      ...updatedTodoData,
    };
  }

  @Delete('/delete/:id')
  @ApiOperation({
    summary: 'Deletes the todo with the given id',
    description:
      'Todo microservice checks if user have permission to do the operation',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Todo deleted',
    type: TodoResponse,
  })
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  async deleteTodo(@Param('id') id: string, @Req() request: IUserFromRequest) {
    const { user } = request;
    const deleteTodoResponse = await this.todoServiceClient.send<TodoResponse>(
      Pattern.TODO_DELETE_TODO,
      {
        todoId: id,
        userId: user.id,
      },
    );

    const deletedTodoData = await lastValueFrom(deleteTodoResponse);

    if (deletedTodoData.error || deletedTodoData.data === null) {
      throw new InternalServerErrorException(deletedTodoData.error);
    }

    return {
      ...deletedTodoData,
    };
  }
}
