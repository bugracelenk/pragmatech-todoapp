import { User } from "src/schemas/user.schema";

export type Rpt = {
  resetPasswordToken: string;
  user: User;
  status: boolean;
};
