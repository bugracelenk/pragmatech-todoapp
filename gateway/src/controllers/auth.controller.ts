import {
  Post,
  Body,
  Controller,
  Inject,
  HttpStatus,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { UserLoginDto, UserRegisterDto } from 'src/dto/user.dto';
import { Pattern } from 'src/patterns.enum';
import {
  UserLoginResponse,
  UserRegisterResponse,
} from 'src/responses/user.response';
import { lastValueFrom } from 'rxjs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN || HttpStatus.ACCEPTED,
    type: 'UserLoginResponse',
    description: 'Logged in',
  })
  async login(@Body() loginDto: UserLoginDto) {
    const tokenResponse = await this.userServiceClient.send<UserLoginResponse>(
      Pattern.USER_LOGIN,
      { ...loginDto },
    );

    const tokenData = await lastValueFrom(tokenResponse);

    if (tokenData.status === HttpStatus.FORBIDDEN) {
      throw new UnauthorizedException(tokenData.message);
    }

    return tokenData;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN || HttpStatus.ACCEPTED,
    type: 'UserRegisterResponse',
    description: 'Registered user',
  })
  async register(@Body() registerDto: UserRegisterDto) {
    const tokenResponse =
      await this.userServiceClient.send<UserRegisterResponse>(
        Pattern.USER_REGISTER,
        { ...registerDto },
      );

    const tokenData = await lastValueFrom(tokenResponse);

    return tokenData;
  }
}
