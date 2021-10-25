import { IsNotEmpty, IsEmail } from "class-validator";
import * as Messages from "../utilities/messages.data";

export class UserChangePasswordDto {
  @IsNotEmpty({ message: Messages.notEmpty("email") })
  @IsEmail({ allow_display_name: true }, { message: Messages.notValid("email") })
  email: string;
  @IsNotEmpty({ message: Messages.notEmpty("reset token") })
  resetPasswordToken: string;
  @IsNotEmpty({ message: Messages.notEmpty("password") })
  password: string;
}
