import { Todo } from '../schemas/todo.schema';
import { User } from '../interfaces/user.interface';

export function havePermission(permissionArg: {
  todo: Todo;
  user: Partial<User>;
  requiredRole: string;
}): boolean {
  const { todo, user, requiredRole } = permissionArg;

  if (todo.createdBy === user.id) return true;
  else if (todo.assignedTo === user.id) return true;
  else if (todo.team.members.includes(user.id)) return true;
  else if (user.userType === requiredRole) return true;
  else return false;
}
