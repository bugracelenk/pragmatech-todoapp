import { User } from "src/schemas/user.schema";

export type UserResponse = {
  id?: string;
  error?: string;
  status: number;
  banReason?: string;
  token?: string;
  message?: string;
  user?: User;
};
