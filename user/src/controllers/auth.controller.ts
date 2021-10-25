import { Controller, ValidationPipe, UsePipes, HttpStatus } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ERROR_MESSAGES } from "src/utilities/messages.data";
import { UserCreateDto } from "../dtos/user.create.dto";
import { UserLoginDto } from "../dtos/auth.login.dto";
import { AuthService } from "../services/auth.service";
import { Pattern } from "src/pattern.enum";
import { UserRegisterResponse } from "src/responses/register.response.type";
import { UserLoginResponse } from "src/responses/login.response.type";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern(Pattern.REGISTER)
  @UsePipes(ValidationPipe)
  async register(createDto: UserCreateDto): Promise<UserRegisterResponse> {
    const token = await this.authService.create(createDto);
    return { token, status: HttpStatus.ACCEPTED };
  }

  @MessagePattern(Pattern.LOGIN)
  @UsePipes(ValidationPipe)
  async login(loginDto: UserLoginDto): Promise<UserLoginResponse> {
    const token = await this.authService.login(loginDto);
    if (token === ERROR_MESSAGES.NOT_AUTHORIZED) {
      return { token: "", status: HttpStatus.FORBIDDEN, message: ERROR_MESSAGES.NOT_AUTHORIZED };
    }
    return { token, status: HttpStatus.ACCEPTED };
  }

  @MessagePattern(Pattern.VALIDATE_TOKEN)
  async validateToken(validateTokenDto: { token: string }) {
    return await this.authService.validateToken(validateTokenDto.token);
  }
}
