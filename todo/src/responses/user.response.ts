import { IUser } from 'src/interfaces/user.interface';

export type UserResponse = {
  error?: string;
  message?: string;
  status?: number;
  user?: string | IUser;
};
