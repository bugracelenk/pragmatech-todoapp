import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import * as Messages from '../utilities/messages.data';

enum TodoStatus {
  ACTIVE = 'ACTIVE',
  INPROGRESS = 'INPROGRESS',
  DONE = 'DONE',
}

export class TodoCreateDto {
  id: string;

  @IsNotEmpty({ message: Messages.notEmpty('title') })
  title: string;

  @IsOptional()
  @IsString({ message: Messages.notValid('desc', 'string') })
  desc: string;

  @IsNotEmpty({ message: Messages.notEmpty('createdBy') })
  @IsMongoId({ message: Messages.notValid('createdBy', 'ObjectId') })
  createdBy: string;

  @IsEnum(TodoStatus, { message: Messages.notValid('status') })
  status: TodoStatus;

  @IsBoolean({ message: Messages.notValid('assigned') })
  assigned: boolean;

  @IsOptional()
  @IsMongoId({ message: Messages.notValid('assignedTo', 'ObjectId') })
  assignedTo: string;

  @IsBoolean({ message: Messages.notValid('private') })
  private: boolean;

  @IsOptional()
  @IsMongoId({ message: Messages.notValid('team', 'ObjectId') })
  team: string;

  @IsOptional()
  @IsBoolean({ message: Messages.notValid('archived') })
  archived: boolean;
}

export class TodoGetTodosByUserDto {
  @IsNotEmpty({ message: Messages.notEmpty('userId') })
  @IsMongoId({ message: Messages.notValid('userId', 'ObjectId') })
  userId: string;

  @IsOptional()
  @IsNumberString(
    { no_symbols: true },
    { message: Messages.notValid('perPage', 'number') },
  )
  perPage: string;

  @IsOptional()
  @IsNumberString(
    { no_symbols: true },
    { message: Messages.notValid('perPage', 'number') },
  )
  page: string;
}

export class TodoGetTodosByTeamDto {
  @IsNotEmpty({ message: Messages.notEmpty('teamId') })
  @IsMongoId({ message: Messages.notValid('teamId', 'ObjectId') })
  teamId: string;

  @IsOptional()
  @IsNumberString(
    { no_symbols: true },
    { message: Messages.notValid('perPage', 'number') },
  )
  perPage: string;

  @IsOptional()
  @IsNumberString(
    { no_symbols: true },
    { message: Messages.notValid('page', 'number') },
  )
  page: string;
}

export class TodoSearchDto {
  @IsOptional()
  @IsString({ message: Messages.notValid('title', 'string') })
  title: string;

  @IsOptional()
  @IsMongoId({ message: Messages.notValid('team', 'ObjectId') })
  team: string;

  @IsOptional()
  @IsMongoId({ message: Messages.notValid('createdBy', 'ObjectId') })
  createdBy: string;

  @IsOptional()
  @IsEnum(TodoStatus)
  status: TodoStatus;

  @IsOptional()
  @IsBoolean({ message: Messages.notValid('assigned', 'boolean') })
  archived: boolean;

  @IsOptional()
  @IsMongoId({ message: Messages.notValid('assignedTo', 'ObjectId') })
  assignedTo: string;

  @IsOptional()
  @IsBoolean({ message: Messages.notValid('assigned', 'boolean') })
  assigned: boolean;

  @IsOptional()
  @IsNumberString(
    { no_symbols: true },
    { message: Messages.notValid('perPage', 'number') },
  )
  perPage: string;

  @IsOptional()
  @IsNumberString(
    { no_symbols: true },
    { message: Messages.notValid('page', 'number') },
  )
  page: string;
}

export class TodoUpdateDto {
  @IsOptional()
  @IsString({ message: Messages.notValid('title', 'string') })
  title: string;

  @IsOptional()
  @IsEnum(TodoStatus)
  status: TodoStatus;

  @IsOptional()
  @IsMongoId({ message: Messages.notValid('assignedTo', 'ObjectId') })
  assignedTo: string;

  @IsOptional()
  @IsBoolean({ message: Messages.notValid('assigned', 'boolean') })
  assigned: boolean;

  @IsOptional()
  @IsBoolean({ message: Messages.notValid('private', 'boolean') })
  private: boolean;

  @IsOptional()
  @IsBoolean({ message: Messages.notValid('archived', 'boolean') })
  archived: boolean;
}
