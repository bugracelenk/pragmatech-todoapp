import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserCreateDto } from "../dtos/user.create.dto";
import { UserLoginDto } from "../dtos/auth.login.dto";
import { AuthRepository } from "../repositories/auth.repository";
import { ERROR_MESSAGES } from "src/utilities/messages.data";

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository, private jwtService: JwtService) {}

  async create(createArgs: UserCreateDto): Promise<string> {
    const newUser = await this.authRepository.create(createArgs);
    return await this.jwtService.signAsync({
      userType: newUser.userType,
      email: newUser.email,
      id: newUser.id,
    });
  }

  async login(loginArgs: UserLoginDto): Promise<string> {
    const user = await this.authRepository.getUserByEmail(loginArgs);
    if (!user) {
      return ERROR_MESSAGES.NOT_AUTHORIZED;
    }

    const compareResult = await bcrypt.compare(loginArgs.password, user.password);

    if (!compareResult) {
      return ERROR_MESSAGES.NOT_AUTHORIZED;
    }

    return await this.jwtService.signAsync({
      userType: user.userType,
      userStatus: user.userStatus,
      username: user.username,
      email: user.email,
      id: user.id,
    });
  }

  async validateToken(token: string) {
    return await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
  }
}
