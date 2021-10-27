import { Team } from 'src/schemas/team.schema';

export type TeamResponse = {
  status: number;
  team: Team | any;
  message?: string;
  error?: string;
};
