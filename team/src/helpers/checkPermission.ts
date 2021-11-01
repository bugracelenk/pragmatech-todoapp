import { Team } from '../schemas/team.schema';
import { IUser } from '../interfaces/user.interface';

export function havePermission(permissionArg: {
  team: Team;
  user: Partial<IUser>;
  requiredUserRole: string;
  canMembersDo: boolean;
}): boolean {
  const { team, user, requiredUserRole, canMembersDo } = permissionArg;

  if (team.createdBy.id === user.id) return true;
  else if (team.leader.id === user.id) return true;
  else if (team.moderators.includes(user.id)) return true;
  else if (canMembersDo && team.members.includes(user.id)) return true;
  else if (user.userType === requiredUserRole) return true;
  else return false;
}
