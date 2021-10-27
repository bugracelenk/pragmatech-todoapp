import { Team } from 'src/interfaces/team.interface';

export type TeamResponse = {
  status: number;
  team: Team;
  meesage?: string;
  error?: string;
};
