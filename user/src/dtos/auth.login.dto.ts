import { IsNotEmpty, IsEmail } from "class-validator";
import * as Messages from "../utilities/messages.data";

export class UserLoginDto {
  @IsNotEmpty({ message: Messages.notEmpty("email") })
  @IsEmail({ allow_display_name: true }, { message: Messages.notValid("email") })
  email: string;
  @IsNotEmpty({ message: Messages.notEmpty("password") })
  password: string;
}
