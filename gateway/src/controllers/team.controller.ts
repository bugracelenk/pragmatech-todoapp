import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TeamCreateDto, TeamUpdateTeamDto } from 'src/dto/team.dto';
import { ActiveStatusGuard } from 'src/guards/active.user.guard';
import { JwtGuard } from 'src/guards/jwt.guard';
import { IUserFromRequest } from 'src/interfaces/user.interface';
import { Pattern } from 'src/patterns.enum';
import { TeamResponse } from 'src/responses/team.response';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserStatus, UserStatuses } from 'src/decorators/status.decorator';
import { GetIdDto } from 'src/dto/common.dto';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(
    @Inject('TEAM_SERVICE') private readonly teamClientService: ClientProxy,
  ) {}

  @Post('')
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Creates new team',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Team created successfully',
    type: TeamResponse,
  })
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  async createTeam(
    @Body() createTeamDto: TeamCreateDto,
    @Req() request: IUserFromRequest,
  ) {
    const { user } = request;

    const createTeamResponse = await this.teamClientService.send<TeamResponse>(
      Pattern.CREATE_TEAM,
      {
        name: createTeamDto.name,
        leader: user.id,
        createdBy: user.id,
        teamStatus: 'ACTIVE',
      },
    );

    const createTeamData = await lastValueFrom(createTeamResponse);

    if (createTeamData.error) {
      throw new InternalServerErrorException(createTeamData.error);
    }

    return {
      ...createTeamData,
    };
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Gets team with the given id',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Team data retrieved',
    type: TeamResponse,
  })
  @UsePipes(ValidationPipe)
  async getTeamById(@Param() getByIdDto: GetIdDto) {
    const response = await this.teamClientService.send<TeamResponse>(
      Pattern.GET_TEAM,
      {
        ...getByIdDto,
      },
    );

    const data = await lastValueFrom(response);

    if (data.error) {
      throw new InternalServerErrorException(data.error);
    }

    return {
      ...data,
    };
  }

  @Patch('/update/:id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Updates team with the given id and parameters',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Team updated',
    type: TeamResponse,
  })
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  async updateTeam(
    @Param() getId: GetIdDto,
    @Body() updateTeamDto: TeamUpdateTeamDto,
    @Req() request: IUserFromRequest,
  ) {
    const { user } = request;
    const response = await this.teamClientService.send<TeamResponse>(
      Pattern.UPDATE_TEAM,
      {
        teamId: getId.id,
        userId: user.id,
        updateArgs: updateTeamDto,
      },
    );

    const data = await lastValueFrom(response);

    if (data.error) {
      throw new InternalServerErrorException(data.error);
    }

    return {
      ...data,
    };
  }

  @Patch('/add-member/:id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Add team member to the team with the given team id and user id',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Team member added',
    type: TeamResponse,
  })
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  async addMemberToTeam(
    @Param() getId: GetIdDto,
    @Body() getUserIdDto: GetIdDto,
    @Req() request: IUserFromRequest,
  ) {
    const { user } = request;
    const response = await this.teamClientService.send<TeamResponse>(
      Pattern.ADD_MEMBER,
      {
        teamId: getId.id,
        userId: getUserIdDto.id,
        operatingUserId: user.id,
      },
    );

    const data = await lastValueFrom(response);

    if (data.error) {
      throw new InternalServerErrorException(data.error);
    }

    return {
      ...data,
    };
  }

  @Patch('/remove-member/:id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Removes team member from team with the given team id and user id',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Team member removed',
    type: TeamResponse,
  })
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  async removeMemberFromTeam(
    @Param() getId: GetIdDto,
    @Body() getUserIdDto: GetIdDto,
    @Req() request: IUserFromRequest,
  ) {
    const { user } = request;
    const response = await this.teamClientService.send<TeamResponse>(
      Pattern.REMOVE_MEMBER,
      {
        teamId: getId.id,
        userId: getUserIdDto.id,
        operatingUserId: user.id,
      },
    );

    const data = await lastValueFrom(response);

    if (data.error) {
      throw new InternalServerErrorException(data.error);
    }

    return {
      ...data,
    };
  }

  @Patch('/add-moderator/:id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary:
      'Adds team moderator to the team with the given team id and user id',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Team moderator added',
    type: TeamResponse,
  })
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  async addModeratorToTeam(
    @Param() getId: GetIdDto,
    @Body() getUserIdDto: GetIdDto,
    @Req() request: IUserFromRequest,
  ) {
    const { user } = request;
    const response = await this.teamClientService.send<TeamResponse>(
      Pattern.ADD_MODERATOR,
      {
        teamId: getId.id,
        userId: getUserIdDto.id,
        operatingUserId: user.id,
      },
    );

    const data = await lastValueFrom(response);

    if (data.error) {
      throw new InternalServerErrorException(data.error);
    }

    return {
      ...data,
    };
  }

  @Patch('/remove-moderator/:id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary:
      'Removes team moderator from the team with the given team id and user id',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Team moderator removed',
    type: TeamResponse,
  })
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  async removeModeratorToTeam(
    @Param() getId: GetIdDto,
    @Body() getUserIdDto: GetIdDto,
    @Req() request: IUserFromRequest,
  ) {
    const { user } = request;
    const response = await this.teamClientService.send<TeamResponse>(
      Pattern.REMOVE_MODERATOR,
      {
        teamId: getId.id,
        userId: getUserIdDto.id,
        operatingUserId: user.id,
      },
    );

    const data = await lastValueFrom(response);

    if (data.error) {
      throw new InternalServerErrorException(data.error);
    }

    return {
      ...data,
    };
  }
}
