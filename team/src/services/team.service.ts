import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TeamCreateDto } from 'src/dtos/team.create.dto';
import { TeamUpdateDto } from 'src/dtos/team.update.dto';
import { Patterns } from 'src/patterns.enum';
import { TeamRepository } from '../repositories/team.repository';
import { Team } from '../schemas/team.schema';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async createTeam(createArgs: TeamCreateDto): Promise<Team> {
    const team = await this.teamRepository.createTeam(createArgs);

    await this.userServiceClient.send(Patterns.ADD_USER_TEAM, { team });

    return team;
  }

  async getTeamById(teamId: string): Promise<Team> {
    return this.teamRepository.getTeamById(teamId);
  }

  async updateTeam(teamId: string, updateArgs: TeamUpdateDto): Promise<Team> {
    return this.teamRepository.updateTeam(teamId, updateArgs);
  }

  async addUserToTeam(teamId: string, userId: string): Promise<Team> {
    const team = await this.teamRepository.addUserToTeam(teamId, userId);

    await this.userServiceClient.send(Patterns.ADD_USER_TEAM, { team });

    return team;
  }

  async removeUserFromTeam(teamId: string, userId: string): Promise<Team> {
    await this.userServiceClient.send(Patterns.REMOVE_USER_TEAM, {
      teamId: teamId,
    });

    return await this.teamRepository.removeUserFromTeam(teamId, userId);
  }

  async grantModeratorRoleToMember(
    teamId: string,
    userId: string,
  ): Promise<Team> {
    return this.teamRepository.grantModeratorRoleToMember(teamId, userId);
  }

  async takeModeratorRoleFromMember(
    teamId: string,
    userId: string,
  ): Promise<Team> {
    return this.teamRepository.takeModeratorRoleFromMember(teamId, userId);
  }

  async addTodoToTeam(teamId: string, todoId: string): Promise<Team> {
    return this.teamRepository.addTodoToTeam(teamId, todoId);
  }

  async removeTodoFromTeam(teamId: string, todoId: string): Promise<Team> {
    return this.teamRepository.removeTodoFromTeam(teamId, todoId);
  }
}
