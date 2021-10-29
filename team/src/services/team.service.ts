import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TeamCreateDto } from 'src/dtos/team.create.dto';
import { TeamUpdateDto } from 'src/dtos/team.update.dto';
import { havePermission } from 'src/helpers/checkPermission';
import { Patterns } from 'src/patterns.enum';
import { UserResponse } from 'src/responses/user.response';
import { TeamRepository } from '../repositories/team.repository';
import { Team } from '../schemas/team.schema';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async checkPermissionForOperation(
    teamId: string,
    userId: string,
    canMembersDo: boolean,
  ): Promise<boolean> {
    const team = await this.teamRepository.getTeamById(teamId);

    const userClientResponse = await this.userServiceClient.send<UserResponse>(
      Patterns.GET_USER_BY_ID,
      {
        id: userId,
      },
    );
    const userData = await lastValueFrom(userClientResponse);
    //user not found or microservice internal error
    if (userData.error) {
      return false;
    }
    //check permission for user
    if (
      typeof userData.user !== 'string' &&
      !havePermission({
        team,
        user: userData.user,
        requiredUserRole: 'ADMIN',
        canMembersDo,
      })
    ) {
      return false;
    }
  }

  async createTeam(createArgs: TeamCreateDto): Promise<Team> {
    const team = await this.teamRepository.createTeam(createArgs);

    await this.userServiceClient.send(Patterns.ADD_USER_TEAM, {
      userId: team.createdBy,
      teamId: team.id,
    });

    return team;
  }

  async getTeamById(teamId: string): Promise<Team> {
    return this.teamRepository.getTeamById(teamId);
  }

  async updateTeam(
    teamId: string,
    userId: string,
    updateArgs: TeamUpdateDto,
  ): Promise<Team | { error?: string; status: number }> {
    const permission = await this.checkPermissionForOperation(
      teamId,
      userId,
      false,
    );

    if (!permission) {
      return { error: 'FORBIDDEN', status: HttpStatus.FORBIDDEN };
    }

    return this.teamRepository.updateTeam(teamId, updateArgs);
  }

  async addUserToTeam(
    teamId: string,
    userId: string,
  ): Promise<Team | { error?: string; status: number }> {
    const permission = await this.checkPermissionForOperation(
      teamId,
      userId,
      false,
    );

    if (!permission) {
      return { error: 'FORBIDDEN', status: HttpStatus.FORBIDDEN };
    }

    await this.userServiceClient.send(Patterns.ADD_USER_TEAM, {
      userId,
      teamId,
    });

    return await this.teamRepository.addUserToTeam(teamId, userId);
  }

  async removeUserFromTeam(
    teamId: string,
    userId: string,
  ): Promise<Team | { error?: string; status: number }> {
    const permission = await this.checkPermissionForOperation(
      teamId,
      userId,
      false,
    );

    if (!permission) {
      return { error: 'FORBIDDEN', status: HttpStatus.FORBIDDEN };
    }

    await this.userServiceClient.send(Patterns.REMOVE_USER_TEAM, {
      teamId,
      userId,
    });

    return await this.teamRepository.removeUserFromTeam(teamId, userId);
  }

  async grantModeratorRoleToMember(
    teamId: string,
    userId: string,
  ): Promise<Team | { error?: string; status: number }> {
    const permission = await this.checkPermissionForOperation(
      teamId,
      userId,
      false,
    );

    if (!permission) {
      return { error: 'FORBIDDEN', status: HttpStatus.FORBIDDEN };
    }
    return this.teamRepository.grantModeratorRoleToMember(teamId, userId);
  }

  async takeModeratorRoleFromMember(
    teamId: string,
    userId: string,
  ): Promise<Team | { error?: string; status: number }> {
    const permission = await this.checkPermissionForOperation(
      teamId,
      userId,
      false,
    );

    if (!permission) {
      return { error: 'FORBIDDEN', status: HttpStatus.FORBIDDEN };
    }
    return this.teamRepository.takeModeratorRoleFromMember(teamId, userId);
  }

  async addTodoToTeam(
    teamId: string,
    todoId: string,
    userId: string,
  ): Promise<Team | { error?: string; status: number }> {
    const permission = await this.checkPermissionForOperation(
      teamId,
      userId,
      true,
    );

    if (!permission) {
      return { error: 'FORBIDDEN', status: HttpStatus.FORBIDDEN };
    }
    return this.teamRepository.addTodoToTeam(teamId, todoId);
  }

  async removeTodoFromTeam(
    teamId: string,
    todoId: string,
    userId: string,
  ): Promise<Team | { error?: string; status: number }> {
    return this.teamRepository.removeTodoFromTeam(teamId, todoId);
  }
}
