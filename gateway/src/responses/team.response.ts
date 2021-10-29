import { ITeam } from 'src/interfaces/team.interface';

export class TeamResponse {
  status: number;
  team: ITeam | any;
  message?: string;
  error?: string;
}
