export interface ITeam {
  id: string;
  leader: string;
  createdBy: string;
  moderators: [string];
  members: [string];
  todos: [string];
  teamStatus: string;
}
