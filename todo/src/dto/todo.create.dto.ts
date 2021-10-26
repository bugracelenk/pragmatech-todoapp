import {
  IsNotEmpty,
  IsMongoId,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';
import { TodoStatus } from 'src/schemas/todo.enum';

export class TodoCreateDto {
  id: string;

  @IsNotEmpty({ message: 'Title can not be empty' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Desc field must be a string' })
  desc: string;

  @IsNotEmpty({ message: 'Title can not be empty' })
  @IsMongoId({ message: 'User id is not a valid ObjectId' })
  createdBy: string;

  @IsEnum(TodoStatus, { message: 'Status validation error' })
  status: TodoStatus;

  @IsBoolean({ message: 'Assigned validation error' })
  assigned: boolean;

  @IsOptional()
  @IsMongoId({ message: 'User id is not a valid ObjectId' })
  assignedTo: string;

  @IsBoolean({ message: 'private field validation error' })
  private: boolean;

  @IsOptional()
  @IsMongoId({ message: 'TeamId is not a valid ObjectId ' })
  team: string;

  @IsOptional()
  @IsBoolean({ message: 'archived field validation error' })
  archived: boolean;
}
