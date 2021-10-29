import { Request } from 'express';

export interface IUser {
  id: string;
  email: string;
  username: string;
  userType: string;
  userStatus: string;
}

export interface IUserFromRequest extends Request {
  user: IUser;
}
