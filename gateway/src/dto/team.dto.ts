import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as Messages from '../utilities/messages.data';

enum TeamStatus {
  ACTIVE = 'ACTIVE',
  PASSIVE = 'PASSIVE',
}

export class TeamCreateDto {
  id: string;

  @IsNotEmpty({ message: Messages.notEmpty('name') })
  @IsString({ message: Messages.notValid('name', 'string') })
  @MinLength(3, { message: Messages.minLength('name', 3) })
  @MaxLength(20, { message: Messages.minLength('name', 20) })
  name: string;
}

export class TeamUpdateTeamDto {
  @IsOptional()
  @IsString({ message: Messages.notValid('leader', 'string') })
  title: string;

  @IsOptional()
  @IsMongoId({ message: Messages.notValid('leader', 'ObjectId') })
  leader: string;

  @IsOptional()
  @IsEnum(TeamStatus)
  teamStatus: TeamStatus;
}
