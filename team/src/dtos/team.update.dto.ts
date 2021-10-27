import { TeamStatus } from 'src/schemas/team.enum';

export type TeamUpdateDto = {
  title?: string;
  leader?: string;
  teamStatus?: TeamStatus;
};
