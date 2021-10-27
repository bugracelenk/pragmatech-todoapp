import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { UserUpdateDto } from "../dtos/user.update.dto";
import { User } from "../schemas/user.schema";
import { UserChangePasswordDto } from "../dtos/user.changePassword.dto";
import { ERROR_MESSAGES } from "src/utilities/messages.data";
import { Rpt } from "src/types/rpt.type";
import { ErrorType } from "src/types/error.type";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateUser(updateArgs: UserUpdateDto): Promise<User> {
    const id = updateArgs.id;
    delete updateArgs.id;
    return await this.userRepository.updateUserById(id, updateArgs);
  }

  async changePasswordRequest(email: string): Promise<Partial<Rpt>> {
    const resetPasswordToken = Math.floor(100000 + Math.random() * 900000).toString();
    const updatedUser = await this.userRepository.changePasswordRequest(email, resetPasswordToken);

    if (!updatedUser) {
      return { status: false };
    }

    return { resetPasswordToken, user: updatedUser, status: true };
  }

  async changePassword(changePasswordArgs: UserChangePasswordDto): Promise<User> {
    const newPassword = await bcrypt.hash(changePasswordArgs.password, 10);
    changePasswordArgs.password = newPassword;
    return await this.userRepository.changeUserPassword(changePasswordArgs);
  }

  async banUserById(banUserDto: { id: string; banReason: string }): Promise<User> {
    return await this.userRepository.banUserById(banUserDto.id, banUserDto.banReason);
  }

  async grantAdminRole(id: string): Promise<User> {
    return await this.userRepository.grantAdminRole(id);
  }

  async takeAdminRole(id: string): Promise<User> {
    return await this.userRepository.takeAdminRole(id);
  }

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.getUserById(id);
  }

  async addUsersTodo(userId: string, todoId: string): Promise<User> {
    return await this.userRepository.addUsersTodo(userId, todoId);
  }

  async removeUsersTodo(userId: string, todoId: string): Promise<User> {
    return await this.userRepository.removeUsersTodo(userId, todoId);
  }

  async addUsersTeam(userId: string, teamId: string): Promise<User> {
    return await this.userRepository.addUsersTeam(userId, teamId);
  }

  async removeUsersTeam(userId: string, teamId: string): Promise<User> {
    return await this.userRepository.removeUsersTeam(userId, teamId);
  }
}
