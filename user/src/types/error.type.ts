import { User } from "src/schemas/user.schema";

export type ErrorType = {
  error: string;
  user?: User;
  resetPasswordToken?: string;
};
