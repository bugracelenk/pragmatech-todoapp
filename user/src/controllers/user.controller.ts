import { Controller, InternalServerErrorException, Inject, HttpStatus } from "@nestjs/common";
import { ClientProxy, MessagePattern } from "@nestjs/microservices";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "src/utilities/messages.data";
import { UserChangePasswordDto } from "../dtos/user.changePassword.dto";
import { UserUpdateDto } from "../dtos/user.update.dto";
import { UserService } from "../services/user.service";
import { Pattern } from "../pattern.enum";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject("MAIL_SERVICE") private readonly mailerServiceClient: ClientProxy,
    @Inject("TODO_SERVICE") private readonly todoServiceClient: ClientProxy,
    @Inject("TEAM_SERVICE") private readonly teamServiceClient: ClientProxy
  ) {}

  @MessagePattern(Pattern.UPDATE)
  async updateUser(updateArgs: UserUpdateDto): Promise<{ message: string; id: string } | { error: string }> {
    const updatedUser = await this.userService.updateUser(updateArgs);
    if (!updatedUser) {
      return { error: ERROR_MESSAGES.UPDATE_USER_ERROR };
    }

    return { message: SUCCESS_MESSAGES.UPDATE_SUCCESSFUL, id: updatedUser.id };
  }

  @MessagePattern(Pattern.CHANGE_PASSWORD_REQUEST)
  async changePasswordRequest(data: { email: string }): Promise<{ token: string } | { error: string }> {
    const { resetPasswordToken, status, user } = await this.userService.changePasswordRequest(data.email);
    if (!status) {
      return { error: ERROR_MESSAGES.CHANGE_PASSWORD_REQUEST_ERROR };
    }

    delete user.password;

    await this.mailerServiceClient.send("FORGOT_PASSWORD", {
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      url: "empty",
      token: resetPasswordToken,
      mailType: "FORGOT_PASSWORD",
    });

    return { token: resetPasswordToken };
  }

  @MessagePattern(Pattern.CHANGE_PASSWORD)
  async changePassword(changePasswordArgs: UserChangePasswordDto): Promise<{ message: string } | { error: string }> {
    const updatedUser = await this.userService.changePassword(changePasswordArgs);

    if (!updatedUser) {
      return { error: ERROR_MESSAGES.CHANGE_PASSWORD_ERROR };
    }

    return { message: SUCCESS_MESSAGES.PASSWORD_CHANGED };
  }

  @MessagePattern(Pattern.BAN_USER)
  async banUser(banUserDto: {
    id: string;
    banReason: string;
  }): Promise<{ message: string; id: string; banReason: string } | { error: string }> {
    const bannedUser = await this.userService.banUserById(banUserDto);

    if (!bannedUser) {
      return { error: ERROR_MESSAGES.BAN_USER_ERROR };
    }

    return { message: SUCCESS_MESSAGES.USER_BANNED, id: banUserDto.id, banReason: banUserDto.banReason };
  }

  @MessagePattern(Pattern.GRANT_ADMIN)
  async grantAdminRole(grantAdminRoleDto: {
    id: string;
  }): Promise<{ message: string; id: string } | { error: string }> {
    const grantedUser = await this.userService.grantAdminRole(grantAdminRoleDto.id);

    if (!grantedUser) {
      return { error: ERROR_MESSAGES.GRANT_ADMIN_ERROR };
    }

    return { message: SUCCESS_MESSAGES.GRANT_ADMIN, id: grantAdminRoleDto.id };
  }

  @MessagePattern(Pattern.TAKE_ADMIN)
  async takeAdminRole(takeAdminRoleDto: { id: string }): Promise<{ message: string; id: string } | { error: string }> {
    const takenUser = await this.userService.takeAdminRole(takeAdminRoleDto.id);

    if (!takenUser) {
      return { error: ERROR_MESSAGES.TAKE_ADMIN_ERROR };
    }

    return { message: SUCCESS_MESSAGES.TAKE_ADMIN, id: takeAdminRoleDto.id };
  }

  @MessagePattern(Pattern.GET_USER_BY_ID)
  async getUserById(getUserDto: { id: string }) {
    return await this.userService.getUserById(getUserDto.id);
  }

  @MessagePattern(Pattern.ADD_USER_TODO)
  async addUsersTodo(addUsersTodoDto: {
    userId: string;
    todoId: string;
  }): Promise<{ message?: string; status: number; error?: string }> {
    const { userId, todoId } = addUsersTodoDto;

    const todo = await this.todoServiceClient.send(Pattern.GET_TODO_BY_ID, { todoId });
    if (!todo) {
      return {
        error: "TODO_NOT_FOUND",
        status: HttpStatus.NOT_FOUND,
      };
    }

    const updatedUser = await this.userService.addUsersTodo(userId, todoId);
    if (!updatedUser) {
      return {
        error: `INTERNAL_SERVER_ERROR_${Pattern.ADD_USER_TODO}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      message: `SUCCESS_${Pattern.ADD_USER_TODO}`,
      status: HttpStatus.ACCEPTED,
    };
  }

  @MessagePattern(Pattern.REMOVE_USER_TODO)
  async removeUsersTodo(removeUsersTodoDto: {
    userId: string;
    todoId: string;
  }): Promise<{ message?: string; status: number; error?: string }> {
    const { userId, todoId } = removeUsersTodoDto;

    const todo = await this.todoServiceClient.send(Pattern.GET_TODO_BY_ID, { todoId });
    if (!todo) {
      return {
        error: "TODO_NOT_FOUND",
        status: HttpStatus.NOT_FOUND,
      };
    }

    const updatedUser = await this.userService.removeUsersTodo(userId, todoId);
    if (!updatedUser) {
      return {
        error: `INTERNAL_SERVER_ERROR_${Pattern.REMOVE_USER_TODO}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      message: `SUCCESS_${Pattern.REMOVE_USER_TODO}`,
      status: HttpStatus.ACCEPTED,
    };
  }

  @MessagePattern(Pattern.ADD_USER_TEAM)
  async addUsersTeam(addUsersTeamDto: {
    userId: string;
    teamId: string;
  }): Promise<{ message?: string; status: number; error?: string }> {
    const { userId, teamId } = addUsersTeamDto;

    const team = await this.teamServiceClient.send(Pattern.GET_TODO_BY_ID, { teamId });
    if (!team) {
      return {
        error: "TEAM_NOT_FOUND",
        status: HttpStatus.NOT_FOUND,
      };
    }

    const updatedUser = await this.userService.addUsersTeam(userId, teamId);
    if (!updatedUser) {
      return {
        error: `INTERNAL_SERVER_ERROR_${Pattern.ADD_USER_TEAM}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      message: `SUCCESS_${Pattern.ADD_USER_TEAM}`,
      status: HttpStatus.ACCEPTED,
    };
  }

  @MessagePattern(Pattern.REMOVE_USER_TEAM)
  async removeUsersTeam(removeUsersTeamDto: {
    userId: string;
    teamId: string;
  }): Promise<{ message?: string; status: number; error?: string }> {
    const { userId, teamId } = removeUsersTeamDto;

    const team = await this.teamServiceClient.send(Pattern.GET_TODO_BY_ID, { teamId });
    if (!team) {
      return {
        error: "TEAM_NOT_FOUND",
        status: HttpStatus.NOT_FOUND,
      };
    }

    const updatedUser = await this.userService.removeUsersTeam(userId, teamId);
    if (!updatedUser) {
      return {
        error: `INTERNAL_SERVER_ERROR_${Pattern.REMOVE_USER_TEAM}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      message: `SUCCESS_${Pattern.REMOVE_USER_TEAM}`,
      status: HttpStatus.ACCEPTED,
    };
  }
}
