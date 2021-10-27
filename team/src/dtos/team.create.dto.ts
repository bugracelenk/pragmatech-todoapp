import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsMongoId,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { TeamStatus } from '../schemas/team.enum';

export class TeamCreateDto {
  id: string;

  @IsNotEmpty({ message: 'Team name can not be empty!' })
  @MinLength(3, { message: 'Team name must be at least 3 character long!' })
  @MaxLength(20, { message: 'Team name can be 20 character max!' })
  teamName: string;

  @IsNotEmpty({ message: 'leader can not be empty' })
  @IsMongoId({ message: 'leader id must be a valid MongoDB ObjectId' })
  leader: string;

  @IsNotEmpty({ message: 'createdBy can not be empty' })
  @IsMongoId({ message: 'createdBy id must be a valid MongoDB ObjectId' })
  createdBy: string;

  @IsOptional()
  @IsArray()
  moderators: [string];

  @IsOptional()
  @IsArray()
  members: [string];

  @IsOptional()
  @IsArray()
  todos: [string];

  @IsOptional()
  @IsEnum(TeamStatus, {
    message: 'teamStatus field can be one of ACTIVE or PASSIVE',
  })
  teamStatus: TeamStatus;
}
