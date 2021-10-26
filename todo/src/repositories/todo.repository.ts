import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoCreateDto } from 'src/dto/todo.create.dto';
import { TodoSearchDto } from 'src/dto/todo.search.dto';
import { TodoUpdateDto } from 'src/dto/todo.update.dto';
import { getLimitSkip } from 'src/helpers/paginate';
import { Todo, TodoDocument } from '../schemas/todo.schema';

@Injectable()
export class TodoRepository {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async createTodo(createArgs: TodoCreateDto): Promise<Todo> {
    const newTodo = new this.todoModel(createArgs);
    return await newTodo.save();
  }

  async getTodoById(todoId: string): Promise<Todo> {
    return await this.todoModel
      .findById(todoId)
      .populate('createdBy', 'firstName lastName profileImage username id')
      .populate('assignedTo', 'firstName lastName profileImage username id')
      .populate('team', '-__v')
      .populate(
        'team.teamLeader',
        'firstName lastName profileImage username id',
      )
      .populate(
        'team.createdBy',
        'firstName lastName profileImage username id',
      );
  }

  async getTodosByUser(
    userId: string,
    perPage: string,
    page: string,
  ): Promise<Todo[]> {
    const { limit, skip } = getLimitSkip(perPage, page);
    return await this.todoModel
      .find({ createdBy: userId })
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'firstName lastName profileImage username id')
      .populate('team', '-__v')
      .populate(
        'team.teamLeader',
        'firstName lastName profileImage username id',
      )
      .populate(
        'team.createdBy',
        'firstName lastName profileImage username id',
      );
  }

  async getTodosByTeam(
    teamId: string,
    perPage: string,
    page: string,
  ): Promise<Todo[]> {
    const { limit, skip } = getLimitSkip(perPage, page);

    return await this.todoModel
      .find({ team: teamId, private: false })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'firstName lastName profileImage username id')
      .populate('assignedTo', 'firstName lastName profileImage username id');
  }

  async getTodoWithFilter(
    searchArgs: TodoSearchDto,
    perPage: string,
    page: string,
  ): Promise<Todo[]> {
    const { limit, skip } = getLimitSkip(perPage, page);

    return await this.todoModel
      .find({ ...searchArgs, private: false })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'firstName lastName profileImage username id')
      .populate('assignedTo', 'firstName lastName profileImage username id')
      .populate('team', '-__v')
      .populate(
        'team.teamLeader',
        'firstName lastName profileImage username id',
      )
      .populate(
        'team.createdBy',
        'firstName lastName profileImage username id',
      );
  }

  async updateTodoById(id: string, updateArgs: TodoUpdateDto): Promise<Todo> {
    return await this.todoModel.findByIdAndUpdate(id, {
      $set: { ...updateArgs },
    });
  }

  async deleteTodo(id: string): Promise<Todo> {
    return await this.todoModel.findByIdAndDelete(id);
  }
}
