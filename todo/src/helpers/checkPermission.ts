import { Todo } from '../schemas/todo.schema';
import { IUser } from '../interfaces/user.interface';

export function havePermission(permissionArg: {
  todo: Todo;
  user: Partial<IUser>;
  requiredRole: string;
}): boolean {
  const { todo, user, requiredRole } = permissionArg;

  if (todo.createdBy['id'] === user.id) return true;
  else if (todo.assignedTo === user.id) return true;
  else if (todo.team['members'].includes(user.id)) return true;
  else if (user.userType === requiredRole) return true;
  else return false;
}
