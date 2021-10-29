import {
  Inject,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Controller,
} from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { TeamCreateDto } from 'src/dtos/team.create.dto';
import { TeamUpdateDto } from 'src/dtos/team.update.dto';
import { Patterns } from 'src/patterns.enum';
import { TeamResponse } from 'src/responses/team.response';
import { TeamService } from '../services/team.service';

@Controller('team')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('TODO_SERVICE') private readonly todoServiceClient: ClientProxy,
  ) {}

  @MessagePattern(Patterns.CREATE_TEAM)
  @UsePipes(ValidationPipe)
  async createTeam(createArgs: TeamCreateDto): Promise<TeamResponse> {
    //check if user exists
    const user = await this.userServiceClient.send(Patterns.GET_USER_BY_ID, {
      id: createArgs.createdBy,
    });

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'user not found!',
        team: null,
      };
    }

    const team = await this.teamService.createTeam(createArgs);

    if (!team) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR_CREATE_TEAM',
        team: null,
      };
    }

    return {
      status: HttpStatus.CREATED,
      team,
    };
  }

  @MessagePattern(Patterns.GET_TEAM)
  async getTeamById(data: { id: string }): Promise<TeamResponse> {
    const team = await this.teamService.getTeamById(data.id);
    if (!team) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'Team not found with the given id',
        team: null,
      };
    }

    return {
      status: HttpStatus.ACCEPTED,
      team,
    };
  }

  @MessagePattern(Patterns.UPDATE_TEAM)
  async updateTeam(data: {
    teamId: string;
    userId: string;
    updateArgs: TeamUpdateDto;
  }): Promise<TeamResponse> {
    const updatedTeam = await this.teamService.updateTeam(
      data.teamId,
      data.userId,
      data.updateArgs,
    );

    if (!updatedTeam) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR_UPDATE_TEAM',
        team: null,
      };
    }

    return {
      status: HttpStatus.ACCEPTED,
      message: 'TEAM_UPDATED_SUCCESSFULLY',
      team: updatedTeam,
    };
  }

  @MessagePattern(Patterns.ADD_MEMBER)
  async addUserToTeam(data: {
    teamId: string;
    userId: string;
    operatingUserId: string;
  }): Promise<TeamResponse> {
    const user = await this.userServiceClient.send(Patterns.GET_USER_BY_ID, {
      id: data.userId,
    });

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'USER_NOT_FOUND',
        team: null,
      };
    }

    const updatedTeam = await this.teamService.addUserToTeam(
      data.teamId,
      data.userId,
      data.operatingUserId,
    );

    if (!updatedTeam) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR_ADD_MEMBER',
        team: null,
      };
    }

    return {
      status: HttpStatus.ACCEPTED,
      message: 'TEAM_MEMBER_ADDED_SUCCESSFULLY',
      team: updatedTeam,
    };
  }

  @MessagePattern(Patterns.REMOVE_MEMBER)
  async removeUserFromTeam(data: {
    teamId: string;
    userId: string;
    operatingUserId: string;
  }): Promise<TeamResponse> {
    const user = await this.userServiceClient.send(Patterns.GET_USER_BY_ID, {
      id: data.userId,
    });

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'USER_NOT_FOUND',
        team: null,
      };
    }

    const updatedTeam = await this.teamService.removeUserFromTeam(
      data.teamId,
      data.userId,
      data.operatingUserId,
    );

    if (!updatedTeam) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR_REMOVE_MEMBER',
        team: null,
      };
    }

    return {
      status: HttpStatus.ACCEPTED,
      message: 'TEAM_MEMBER_REMOVED_SUCCESSFULLY',
      team: updatedTeam,
    };
  }

  @MessagePattern(Patterns.ADD_TODO)
  async addTodoToTeam(data: {
    teamId: string;
    todoId: string;
    operatingUserId: string;
  }): Promise<TeamResponse> {
    const todo = await this.todoServiceClient.send(Patterns.GET_TODO_BY_ID, {
      id: data.todoId,
    });

    if (!todo) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'TODO_NOT_FOUND',
        team: null,
      };
    }

    const updatedTeam = await this.teamService.addTodoToTeam(
      data.teamId,
      data.todoId,
      data.operatingUserId,
    );

    if (!updatedTeam) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR_ADD_TODO',
        team: null,
      };
    }

    return {
      status: HttpStatus.ACCEPTED,
      message: 'TODO_ADDED_TO_TEAM_SUCCESSFULLY',
      team: updatedTeam,
    };
  }

  @MessagePattern(Patterns.REMOVE_TODO)
  async removeTodoFromTeam(data: {
    teamId: string;
    todoId: string;
  }): Promise<TeamResponse> {
    const todo = await this.todoServiceClient.send(Patterns.GET_TODO_BY_ID, {
      id: data.todoId,
    });

    if (!todo) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'TODO_NOT_FOUND',
        team: null,
      };
    }

    const updatedTeam = await this.teamService.removeTodoFromTeam(
      data.teamId,
      data.todoId,
    );

    return {
      status: HttpStatus.ACCEPTED,
      message: 'TODO_REMOVED_FROM_TEAM_SUCCESSFULLY',
      team: updatedTeam,
    };
  }

  @MessagePattern(Patterns.ADD_MODERATOR)
  async addModeratorToTeam(data: {
    teamId: string;
    userId: string;
    operatingUserId: string;
  }): Promise<TeamResponse> {
    const user = await this.userServiceClient.send(Patterns.GET_USER_BY_ID, {
      id: data.userId,
    });

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'USER_NOT_FOUND',
        team: null,
      };
    }

    const updatedTeam = await this.teamService.grantModeratorRoleToMember(
      data.teamId,
      data.userId,
      data.operatingUserId,
    );

    if (!updatedTeam) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR_GRANT_MODERATOR',
        team: null,
      };
    }

    return {
      status: HttpStatus.ACCEPTED,
      message: 'MODERATOR_ADDED_TO_TEAM_SUCCESSFULLY',
      team: updatedTeam,
    };
  }

  @MessagePattern(Patterns.REMOVE_MODERATOR)
  async removeModeratorFromTeam(data: {
    teamId: string;
    userId: string;
    operatingUserId: string;
  }): Promise<TeamResponse> {
    const user = await this.userServiceClient.send(Patterns.GET_USER_BY_ID, {
      id: data.userId,
    });

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'TODO_NOT_FOUND',
        team: null,
      };
    }

    const updatedTeam = await this.teamService.removeUserFromTeam(
      data.teamId,
      data.userId,
      data.operatingUserId,
    );

    if (!updatedTeam) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR_REMOVE_MODERATOR',
        team: null,
      };
    }

    return {
      status: HttpStatus.ACCEPTED,
      message: 'MODERATOR_REMOVED_FROM_TEAM_SUCCESSFULLY',
      team: updatedTeam,
    };
  }
}
