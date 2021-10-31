import { Controller, InternalServerErrorException, Inject, HttpStatus } from "@nestjs/common";
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "src/utilities/messages.data";
import { UserChangePasswordDto } from "../dtos/user.changePassword.dto";
import { UserUpdateDto } from "../dtos/user.update.dto";
import { UserService } from "../services/user.service";
import { Pattern } from "../pattern.enum";
import { sendAck } from "src/helpers/sendAck";
import { UserResponse } from "src/responses/user.response";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject("MAIL_SERVICE") private readonly mailerServiceClient: ClientProxy,
    @Inject("TODO_SERVICE") private readonly todoServiceClient: ClientProxy,
    @Inject("TEAM_SERVICE") private readonly teamServiceClient: ClientProxy
  ) {}

  @MessagePattern(Pattern.GET_USER)
  async getUser(@Payload() args: { id: string }, @Ctx() context: RmqContext): Promise<UserResponse> {
    try {
      let data: UserResponse;

      const user = await this.userService.getUserById(args.id);
      if (!user) {
        data = {
          error: "USER_NOT_FOUND",
          status: HttpStatus.NOT_FOUND,
        };
      }

      data = {
        user,
        status: HttpStatus.ACCEPTED,
      };

      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message };
    }
  }

  @MessagePattern(Pattern.UPDATE)
  async updateUser(@Payload() updateArgs: UserUpdateDto, @Ctx() context: RmqContext): Promise<UserResponse> {
    try {
      let data: UserResponse;
      const updatedUser = await this.userService.updateUser(updateArgs);
      if (!updatedUser) {
        data = { error: ERROR_MESSAGES.UPDATE_USER_ERROR, status: HttpStatus.INTERNAL_SERVER_ERROR };
      }

      data = { message: SUCCESS_MESSAGES.UPDATE_SUCCESSFUL, id: updatedUser.id, status: HttpStatus.ACCEPTED };

      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message };
    }
  }

  @MessagePattern(Pattern.CHANGE_PASSWORD_REQUEST)
  async changePasswordRequest(@Payload() args: { email: string }, @Ctx() context: RmqContext): Promise<UserResponse> {
    try {
      let data: UserResponse;
      const { resetPasswordToken, status, user } = await this.userService.changePasswordRequest(args.email);
      if (!status) {
        data = { error: ERROR_MESSAGES.CHANGE_PASSWORD_REQUEST_ERROR, status: HttpStatus.INTERNAL_SERVER_ERROR };
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

      data = { token: resetPasswordToken, status: HttpStatus.ACCEPTED };
      return data;
    } catch (error) {
      sendAck(context);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message };
    }
  }

  @MessagePattern(Pattern.CHANGE_PASSWORD)
  async changePassword(
    @Payload() changePasswordArgs: UserChangePasswordDto,
    @Ctx() context: RmqContext
  ): Promise<UserResponse> {
    try {
      let data: UserResponse;
      const updatedUser = await this.userService.changePassword(changePasswordArgs);

      if (!updatedUser) {
        data = { error: ERROR_MESSAGES.CHANGE_PASSWORD_ERROR, status: HttpStatus.INTERNAL_SERVER_ERROR };
      }

      data = { message: SUCCESS_MESSAGES.PASSWORD_CHANGED, status: HttpStatus.ACCEPTED };
      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message };
    }
  }

  @MessagePattern(Pattern.BAN_USER)
  async banUser(
    @Payload() banUserDto: { id: string; banReason: string },
    @Ctx() context: RmqContext
  ): Promise<UserResponse> {
    try {
      let data: UserResponse;
      const bannedUser = await this.userService.banUserById(banUserDto);

      if (!bannedUser) {
        data = { error: ERROR_MESSAGES.BAN_USER_ERROR, status: HttpStatus.INTERNAL_SERVER_ERROR };
      }

      data = {
        message: SUCCESS_MESSAGES.USER_BANNED,
        id: banUserDto.id,
        banReason: banUserDto.banReason,
        status: HttpStatus.ACCEPTED,
      };
      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message };
    }
  }

  @MessagePattern(Pattern.GRANT_ADMIN)
  async grantAdminRole(
    @Payload() grantAdminRoleDto: { id: string },
    @Ctx() context: RmqContext
  ): Promise<UserResponse> {
    try {
      let data: UserResponse;
      const grantedUser = await this.userService.grantAdminRole(grantAdminRoleDto.id);

      if (!grantedUser) {
        data = { error: ERROR_MESSAGES.GRANT_ADMIN_ERROR, status: HttpStatus.INTERNAL_SERVER_ERROR };
      }

      data = { message: SUCCESS_MESSAGES.GRANT_ADMIN, id: grantAdminRoleDto.id, status: HttpStatus.ACCEPTED };
      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message };
    }
  }

  @MessagePattern(Pattern.TAKE_ADMIN)
  async takeAdminRole(@Payload() takeAdminRoleDto: { id: string }, @Ctx() context: RmqContext): Promise<UserResponse> {
    try {
      let data: UserResponse;
      const takenUser = await this.userService.takeAdminRole(takeAdminRoleDto.id);

      if (!takenUser) {
        data = { error: ERROR_MESSAGES.TAKE_ADMIN_ERROR, status: HttpStatus.INTERNAL_SERVER_ERROR };
      }

      data = { message: SUCCESS_MESSAGES.TAKE_ADMIN, id: takeAdminRoleDto.id, status: HttpStatus.ACCEPTED };
      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message };
    }
  }

  @MessagePattern(Pattern.GET_USER_BY_ID)
  async getUserById(getUserDto: { id: string }) {
    return await this.userService.getUserById(getUserDto.id);
  }

  @MessagePattern(Pattern.ADD_USER_TODO)
  async addUsersTodo(
    @Payload() addUsersTodoDto: { userId: string; todoId: string },
    @Ctx() context: RmqContext
  ): Promise<UserResponse> {
    try {
      let data: UserResponse;
      const { userId, todoId } = addUsersTodoDto;

      const todo = await this.todoServiceClient.send(Pattern.GET_TODO_BY_ID, { todoId });
      if (!todo) {
        data = {
          error: "TODO_NOT_FOUND",
          status: HttpStatus.NOT_FOUND,
        };
      }

      const updatedUser = await this.userService.addUsersTodo(userId, todoId);
      if (!updatedUser) {
        data = {
          error: `INTERNAL_SERVER_ERROR_${Pattern.ADD_USER_TODO}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }

      data = {
        message: `SUCCESS_${Pattern.ADD_USER_TODO}`,
        status: HttpStatus.ACCEPTED,
      };
      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message };
    }
  }

  @MessagePattern(Pattern.REMOVE_USER_TODO)
  async removeUsersTodo(
    @Payload()
    removeUsersTodoDto: {
      userId: string;
      todoId: string;
    },
    @Ctx() context: RmqContext
  ): Promise<UserResponse> {
    try {
      let data: UserResponse;
      const { userId, todoId } = removeUsersTodoDto;

      const todo = await this.todoServiceClient.send(Pattern.GET_TODO_BY_ID, { todoId });
      if (!todo) {
        data = {
          error: "TODO_NOT_FOUND",
          status: HttpStatus.NOT_FOUND,
        };
      }

      const updatedUser = await this.userService.removeUsersTodo(userId, todoId);
      if (!updatedUser) {
        data = {
          error: `INTERNAL_SERVER_ERROR_${Pattern.REMOVE_USER_TODO}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }

      data = {
        message: `SUCCESS_${Pattern.REMOVE_USER_TODO}`,
        status: HttpStatus.ACCEPTED,
      };
      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message };
    }
  }

  @MessagePattern(Pattern.ADD_USER_TEAM)
  async addUsersTeam(
    @Payload() addUsersTeamDto: { userId: string; teamId: string },
    @Ctx() context: RmqContext
  ): Promise<UserResponse> {
    try {
      let data: UserResponse;
      const { userId, teamId } = addUsersTeamDto;

      const team = await this.teamServiceClient.send(Pattern.GET_TODO_BY_ID, { teamId });
      if (!team) {
        data = {
          error: "TEAM_NOT_FOUND",
          status: HttpStatus.NOT_FOUND,
        };
      }

      const updatedUser = await this.userService.addUsersTeam(userId, teamId);
      if (!updatedUser) {
        data = {
          error: `INTERNAL_SERVER_ERROR_${Pattern.ADD_USER_TEAM}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }

      data = {
        message: `SUCCESS_${Pattern.ADD_USER_TEAM}`,
        status: HttpStatus.ACCEPTED,
      };
      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message };
    }
  }

  @MessagePattern(Pattern.REMOVE_USER_TEAM)
  async removeUsersTeam(
    @Payload() removeUsersTeamDto: { userId: string; teamId: string },
    @Ctx() context: RmqContext
  ): Promise<UserResponse> {
    try {
      let data: UserResponse;
      const { userId, teamId } = removeUsersTeamDto;

      const team = await this.teamServiceClient.send(Pattern.GET_TODO_BY_ID, { teamId });
      if (!team) {
        data = {
          error: "TEAM_NOT_FOUND",
          status: HttpStatus.NOT_FOUND,
        };
      }

      const updatedUser = await this.userService.removeUsersTeam(userId, teamId);
      if (!updatedUser) {
        data = {
          error: `INTERNAL_SERVER_ERROR_${Pattern.REMOVE_USER_TEAM}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }

      data = {
        message: `SUCCESS_${Pattern.REMOVE_USER_TEAM}`,
        status: HttpStatus.ACCEPTED,
      };

      sendAck(context);
      return data;
    } catch (error) {
      sendAck(context);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message };
    }
  }
}
