import { IsNotEmpty, Matches, MaxLength, MinLength, IsEmail, IsOptional } from "class-validator";
import * as Messages from "../utilities/messages.data";

export class UserCreateDto {
  id: string;

  @IsNotEmpty({ message: Messages.notEmpty("username") })
  @MinLength(8, { message: Messages.minLength("username", 8) })
  @MaxLength(20, { message: Messages.maxLength("username", 20) })
  @Matches(/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/, {
    message: Messages.notValid("username"),
  })
  username: string;

  @IsNotEmpty({ message: Messages.notEmpty("email") })
  @IsEmail({ allow_display_name: true }, { message: Messages.notValid("email") })
  email: string;

  @IsNotEmpty({ message: Messages.notEmpty("password") })
  @MinLength(8, { message: Messages.minLength("password", 12) })
  password: string;

  @IsNotEmpty({ message: Messages.notEmpty("first name") })
  @Matches(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/, {
    message: Messages.notValid("first name"),
  })
  firstName: string;

  @IsNotEmpty({ message: Messages.notEmpty("last name") })
  @Matches(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/, {
    message: Messages.notValid("last name"),
  })
  lastName: string;

  @IsOptional()
  profileImage: string;

  @IsOptional()
  teams: [string];

  @IsOptional()
  todos: [string];
}
