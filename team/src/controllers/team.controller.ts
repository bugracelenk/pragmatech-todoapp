import {
  Inject,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Controller,
} from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { send } from 'process';
import { TeamCreateDto } from 'src/dtos/team.create.dto';
import { TeamUpdateDto } from 'src/dtos/team.update.dto';
import { sendAck } from 'src/helpers/sendAck';
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
  async createTeam(
    @Payload() createArgs: TeamCreateDto,
    @Ctx() context: RmqContext,
  ): Promise<TeamResponse> {
    try {
      let data: TeamResponse;
      //check if user exists
      const user = await this.userServiceClient.send(Patterns.GET_USER_BY_ID, {
        id: createArgs.createdBy,
      });

      if (!user) {
        data = {
          status: HttpStatus.NOT_FOUND,
          error: 'user not found!',
          team: null,
        };
      }

      const team = await this.teamService.createTeam(createArgs);

      if (!team) {
        data = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'INTERNAL_SERVER_ERROR_CREATE_TEAM',
          team: null,
        };
      }

      data = {
        status: HttpStatus.CREATED,
        team,
      };
      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
        team: null,
      };
    }
  }

  @MessagePattern(Patterns.GET_TEAM)
  async getTeamById(
    @Payload() args: { id: string },
    @Ctx() context: RmqContext,
  ): Promise<TeamResponse> {
    try {
      let data: TeamResponse;
      const team = await this.teamService.getTeamById(args.id);
      if (!team) {
        data = {
          status: HttpStatus.NOT_FOUND,
          error: 'Team not found with the given id',
          team: null,
        };
      }

      data = {
        status: HttpStatus.ACCEPTED,
        team,
      };

      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
        team: null,
      };
    }
  }

  @MessagePattern(Patterns.UPDATE_TEAM)
  async updateTeam(
    @Payload()
    args: {
      teamId: string;
      userId: string;
      updateArgs: TeamUpdateDto;
    },
    @Ctx() context: RmqContext,
  ): Promise<TeamResponse> {
    try {
      let data: TeamResponse;
      const updatedTeam = await this.teamService.updateTeam(
        args.teamId,
        args.userId,
        args.updateArgs,
      );

      if (!updatedTeam) {
        data = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'INTERNAL_SERVER_ERROR_UPDATE_TEAM',
          team: null,
        };
      }

      data = {
        status: HttpStatus.ACCEPTED,
        message: 'TEAM_UPDATED_SUCCESSFULLY',
        team: updatedTeam,
      };

      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
        team: null,
      };
    }
  }

  @MessagePattern(Patterns.ADD_MEMBER)
  async addUserToTeam(
    @Payload()
    args: {
      teamId: string;
      userId: string;
      operatingUserId: string;
    },
    @Ctx() context: RmqContext,
  ): Promise<TeamResponse> {
    try {
      let data: TeamResponse;
      const user = await this.userServiceClient.send(Patterns.GET_USER_BY_ID, {
        id: args.userId,
      });

      if (!user) {
        data = {
          status: HttpStatus.NOT_FOUND,
          error: 'USER_NOT_FOUND',
          team: null,
        };
      }

      const updatedTeam = await this.teamService.addUserToTeam(
        args.teamId,
        args.userId,
        args.operatingUserId,
      );

      if (!updatedTeam) {
        data = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'INTERNAL_SERVER_ERROR_ADD_MEMBER',
          team: null,
        };
      }

      data = {
        status: HttpStatus.ACCEPTED,
        message: 'TEAM_MEMBER_ADDED_SUCCESSFULLY',
        team: updatedTeam,
      };

      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
        team: null,
      };
    }
  }

  @MessagePattern(Patterns.REMOVE_MEMBER)
  async removeUserFromTeam(
    @Payload()
    args: {
      teamId: string;
      userId: string;
      operatingUserId: string;
    },
    @Ctx() context: RmqContext,
  ): Promise<TeamResponse> {
    try {
      let data: TeamResponse;
      const user = await this.userServiceClient.send(Patterns.GET_USER_BY_ID, {
        id: args.userId,
      });

      if (!user) {
        data = {
          status: HttpStatus.NOT_FOUND,
          error: 'USER_NOT_FOUND',
          team: null,
        };
      }

      const updatedTeam = await this.teamService.removeUserFromTeam(
        args.teamId,
        args.userId,
        args.operatingUserId,
      );

      if (!updatedTeam) {
        data = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'INTERNAL_SERVER_ERROR_REMOVE_MEMBER',
          team: null,
        };
      }

      data = {
        status: HttpStatus.ACCEPTED,
        message: 'TEAM_MEMBER_REMOVED_SUCCESSFULLY',
        team: updatedTeam,
      };

      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
        team: null,
      };
    }
  }

  @MessagePattern(Patterns.ADD_TODO)
  async addTodoToTeam(
    @Payload()
    args: {
      teamId: string;
      todoId: string;
      operatingUserId: string;
    },
    @Ctx() context: RmqContext,
  ): Promise<TeamResponse> {
    try {
      let data: TeamResponse;
      const todo = await this.todoServiceClient.send(Patterns.GET_TODO_BY_ID, {
        id: args.todoId,
      });

      if (!todo) {
        data = {
          status: HttpStatus.NOT_FOUND,
          error: 'TODO_NOT_FOUND',
          team: null,
        };
      }

      const updatedTeam = await this.teamService.addTodoToTeam(
        args.teamId,
        args.todoId,
        args.operatingUserId,
      );

      if (!updatedTeam) {
        data = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'INTERNAL_SERVER_ERROR_ADD_TODO',
          team: null,
        };
      }

      data = {
        status: HttpStatus.ACCEPTED,
        message: 'TODO_ADDED_TO_TEAM_SUCCESSFULLY',
        team: updatedTeam,
      };

      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
        team: null,
      };
    }
  }

  @MessagePattern(Patterns.REMOVE_TODO)
  async removeTodoFromTeam(
    @Payload()
    args: {
      teamId: string;
      todoId: string;
    },
    @Ctx() context: RmqContext,
  ): Promise<TeamResponse> {
    try {
      let data: TeamResponse;
      const todo = await this.todoServiceClient.send(Patterns.GET_TODO_BY_ID, {
        id: args.todoId,
      });

      if (!todo) {
        data = {
          status: HttpStatus.NOT_FOUND,
          error: 'TODO_NOT_FOUND',
          team: null,
        };
      }

      const updatedTeam = await this.teamService.removeTodoFromTeam(
        args.teamId,
        args.todoId,
      );

      data = {
        status: HttpStatus.ACCEPTED,
        message: 'TODO_REMOVED_FROM_TEAM_SUCCESSFULLY',
        team: updatedTeam,
      };

      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
        team: null,
      };
    }
  }

  @MessagePattern(Patterns.ADD_MODERATOR)
  async addModeratorToTeam(
    @Payload()
    args: {
      teamId: string;
      userId: string;
      operatingUserId: string;
    },
    @Ctx() context: RmqContext,
  ): Promise<TeamResponse> {
    try {
      let data: TeamResponse;
      const user = await this.userServiceClient.send(Patterns.GET_USER_BY_ID, {
        id: args.userId,
      });

      if (!user) {
        data = {
          status: HttpStatus.NOT_FOUND,
          error: 'USER_NOT_FOUND',
          team: null,
        };
      }

      const updatedTeam = await this.teamService.grantModeratorRoleToMember(
        args.teamId,
        args.userId,
        args.operatingUserId,
      );

      if (!updatedTeam) {
        data = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'INTERNAL_SERVER_ERROR_GRANT_MODERATOR',
          team: null,
        };
      }

      data = {
        status: HttpStatus.ACCEPTED,
        message: 'MODERATOR_ADDED_TO_TEAM_SUCCESSFULLY',
        team: updatedTeam,
      };
      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
        team: null,
      };
    }
  }

  @MessagePattern(Patterns.REMOVE_MODERATOR)
  async removeModeratorFromTeam(
    @Payload()
    args: {
      teamId: string;
      userId: string;
      operatingUserId: string;
    },
    @Ctx() context: RmqContext,
  ): Promise<TeamResponse> {
    try {
      let data: TeamResponse;
      const user = await this.userServiceClient.send(Patterns.GET_USER_BY_ID, {
        id: args.userId,
      });

      if (!user) {
        data = {
          status: HttpStatus.NOT_FOUND,
          error: 'TODO_NOT_FOUND',
          team: null,
        };
      }

      const updatedTeam = await this.teamService.removeUserFromTeam(
        args.teamId,
        args.userId,
        args.operatingUserId,
      );

      if (!updatedTeam) {
        data = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'INTERNAL_SERVER_ERROR_REMOVE_MODERATOR',
          team: null,
        };
      }

      data = {
        status: HttpStatus.ACCEPTED,
        message: 'MODERATOR_REMOVED_FROM_TEAM_SUCCESSFULLY',
        team: updatedTeam,
      };
      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
        team: null,
      };
    }
  }
}
