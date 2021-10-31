import { Controller, ValidationPipe, UsePipes, HttpStatus } from "@nestjs/common";
import { Ctx, MessagePattern, RmqContext, Payload } from "@nestjs/microservices";
import { ERROR_MESSAGES } from "src/utilities/messages.data";
import { UserCreateDto } from "../dtos/user.create.dto";
import { UserLoginDto } from "../dtos/auth.login.dto";
import { AuthService } from "../services/auth.service";
import { Pattern } from "src/pattern.enum";
import { AuthResponse } from "src/responses/auth.response";
import { sendAck } from "src/helpers/sendAck";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern(Pattern.REGISTER)
  @UsePipes(ValidationPipe)
  async register(@Payload() createDto: UserCreateDto, @Ctx() context: RmqContext): Promise<AuthResponse> {
    try {
      const token = await this.authService.create(createDto);
      sendAck(context);
      return { token, status: HttpStatus.ACCEPTED };
    } catch (error) {
      sendAck(context);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message, token: null };
    }
  }

  @MessagePattern(Pattern.LOGIN)
  @UsePipes(ValidationPipe)
  async login(@Payload() loginDto: UserLoginDto, @Ctx() context: RmqContext): Promise<AuthResponse> {
    try {
      const token = await this.authService.login(loginDto);
      if (token === ERROR_MESSAGES.NOT_AUTHORIZED) {
        sendAck(context);
        return { token: null, status: HttpStatus.FORBIDDEN, error: ERROR_MESSAGES.NOT_AUTHORIZED };
      }
      sendAck(context);
      return { token, status: HttpStatus.ACCEPTED };
    } catch (error) {
      sendAck(context);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message, token: null };
    }
  }

  // @MessagePattern(Pattern.VALIDATE_TOKEN)
  // async validateToken(validateTokenDto: { token: string }) {
  //   return await this.authService.validateToken(validateTokenDto.token);
  // }
}
