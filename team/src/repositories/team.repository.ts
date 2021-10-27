import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamCreateDto } from 'src/dtos/team.create.dto';
import { TeamUpdateDto } from 'src/dtos/team.update.dto';
import { Team, TeamDocument } from '../schemas/team.schema';

@Injectable()
export class TeamRepository {
  constructor(@InjectModel(Team.name) private teamModel: Model<TeamDocument>) {}

  async createTeam(createTeamDto: TeamCreateDto): Promise<Team> {
    const newTeam = new this.teamModel(createTeamDto);
    return await newTeam.save();
  }

  async getTeamById(teamId: string): Promise<Team> {
    return await this.teamModel
      .findById(teamId)
      .populate('leader', 'firstName lastName username profileImage id')
      .populate('createdBy', 'firstName lastName username profileImage id')
      .populate('moderators', 'firstName lastName username profileImage id')
      .populate('members', 'firstName lastName username profileImage id')
      .populate({
        path: 'todos',
        select: 'id title status createdBy',
        match: {
          archived: false,
          private: false,
        },
        populate: {
          path: 'createdBy',
          select: 'firstName lastName username profileImage id',
        },
      });
  }

  async updateTeam(
    teamId: string,
    updateTeamDto: TeamUpdateDto,
  ): Promise<Team> {
    return await this.teamModel.findByIdAndUpdate(
      teamId,
      {
        $set: { ...updateTeamDto },
      },
      { new: true },
    );
  }

  async addUserToTeam(teamId: string, userId: string): Promise<Team> {
    return await this.teamModel.findByIdAndUpdate(
      teamId,
      {
        $addToSet: { members: userId },
      },
      { new: true },
    );
  }

  async removeUserFromTeam(teamId: string, userId: string): Promise<Team> {
    return await this.teamModel.findByIdAndUpdate(
      teamId,
      {
        $pull: { members: userId },
      },
      { new: true },
    );
  }

  async grantModeratorRoleToMember(
    teamId: string,
    userId: string,
  ): Promise<Team> {
    return await this.teamModel.findByIdAndUpdate(
      teamId,
      { $addToSet: { moderators: userId } },
      { new: true },
    );
  }

  async takeModeratorRoleFromMember(
    teamId: string,
    userId: string,
  ): Promise<Team> {
    return await this.teamModel.findByIdAndUpdate(
      teamId,
      { $pull: { moderators: userId } },
      { new: true },
    );
  }

  async addTodoToTeam(teamId: string, todoId: string): Promise<Team> {
    return await this.teamModel.findByIdAndUpdate(
      teamId,
      { $addToSet: { todos: todoId } },
      { new: true },
    );
  }

  async removeTodoFromTeam(teamId: string, todoId: string): Promise<Team> {
    return await this.teamModel.findByIdAndUpdate(
      teamId,
      { $pull: { todos: todoId } },
      { new: true },
    );
  }

  async getTeamWithoutPopulation(teamId: string): Promise<Team> {
    return await this.teamModel.findById(teamId);
  }
}
