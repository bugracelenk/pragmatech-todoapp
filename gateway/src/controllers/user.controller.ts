import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';
import { Roles, UserType } from 'src/decorators/role.decorator';
import { UserStatus, UserStatuses } from 'src/decorators/status.decorator';
import {
  UserBanUserDto,
  UserChangePasswordDto,
  UserGrantAdminDto,
  UserTakeAdminDto,
  UserUpdateDto,
} from 'src/dto/user.dto';
import { ActiveStatusGuard } from 'src/guards/active.user.guard';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Pattern } from 'src/patterns.enum';
import {
  UserBanUserResponse,
  UserChangePasswordResponse,
  UserForgotPasswordResponse,
  UserGrantAdminRoleResponse,
  UserTakeAdminRoleResponse,
  UserUpdateResponse,
} from 'src/responses/user.response';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @Patch('update')
  @UseGuards(JwtGuard, ActiveStatusGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Updating user' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Updated user',
    type: UserUpdateResponse,
  })
  async updateUser(@Body() updateDto: UserUpdateDto) {
    const updatedUserResponse =
      await this.userServiceClient.send<UserUpdateResponse>(
        Pattern.USER_UPDATE,
        { ...updateDto },
      );

    const updatedUserData = await lastValueFrom(updatedUserResponse);

    if (updatedUserData.error) {
      throw new InternalServerErrorException(updatedUserData.error);
    }

    return {
      status: HttpStatus.ACCEPTED,
      id: updatedUserData.id,
    };
  }

  @Get('forgot-password')
  @ApiOperation({
    summary: 'Forgot Password Endpoint',
    description: 'Returns a token and sends email to user for password change',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Email sent',
    type: UserForgotPasswordResponse,
  })
  async forgotPassword(@Query('email') email: string) {
    const forgotPasswordResponse =
      await this.userServiceClient.send<UserForgotPasswordResponse>(
        Pattern.USER_CHANGE_PASSWORD_REQUEST,
        { email },
      );

    const forgotPasswordData = await lastValueFrom(forgotPasswordResponse);

    if (forgotPasswordData.error) {
      throw new InternalServerErrorException(forgotPasswordData.error);
    }

    return {
      status: HttpStatus.ACCEPTED,
      message: 'Email sent to user! 📨',
    };
  }

  @Post('change-password')
  @ApiOperation({
    summary: 'Changes Password',
    description: 'Changes password via token from the user',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Password changed successfully',
    type: UserChangePasswordResponse,
  })
  async changePassword(@Body() changePasswordDto: UserChangePasswordDto) {
    const changePasswordResponse =
      await this.userServiceClient.send<UserChangePasswordResponse>(
        Pattern.USER_CHANGE_PASSWORD,
        { ...changePasswordDto },
      );

    const changePasswordData = await lastValueFrom(changePasswordResponse);

    if (changePasswordData.error) {
      throw new InternalServerErrorException(changePasswordData.error);
    }

    return {
      status: HttpStatus.ACCEPTED,
      message: changePasswordData.message || 'Password Changed Successfully',
    };
  }

  @Patch('ban')
  @Roles(UserType.ADMIN)
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, RolesGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Bans user with the given id' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Updated user',
    type: UserBanUserResponse,
  })
  async banUser(@Body() banUserDto: UserBanUserDto) {
    const banUserResponse =
      await this.userServiceClient.send<UserBanUserResponse>(
        Pattern.USER_BAN_USER,
        { ...banUserDto },
      );

    const bannedUserData = await lastValueFrom(banUserResponse);

    if (!bannedUserData.error) {
      throw new InternalServerErrorException(bannedUserData.error);
    }

    return {
      ...bannedUserData,
      status: HttpStatus.ACCEPTED,
    };
  }

  @Patch('grant-admin')
  @Roles(UserType.ADMIN)
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, RolesGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Grants user as an admin in the system' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Admin role granted to user',
    type: UserGrantAdminRoleResponse,
  })
  async grantAdminRole(@Body() grantAdminDto: UserGrantAdminDto) {
    const grantAdminResponse =
      await this.userServiceClient.send<UserGrantAdminRoleResponse>(
        Pattern.USER_GRANT_ADMIN,
        { ...grantAdminDto },
      );

    const grantAdminData = await lastValueFrom(grantAdminResponse);

    if (!grantAdminData.error) {
      throw new InternalServerErrorException(grantAdminData.error);
    }

    return {
      ...grantAdminData,
      status: HttpStatus.ACCEPTED,
    };
  }

  @Patch('take-admin')
  @Roles(UserType.ADMIN)
  @UserStatuses(UserStatus.ACTIVE)
  @UseGuards(JwtGuard, RolesGuard, ActiveStatusGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Takes users admin role' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Admin role taken from user',
    type: UserTakeAdminRoleResponse,
  })
  async takeAdminRole(@Body() takeAdminDto: UserTakeAdminDto) {
    const takeAdminResponse =
      await this.userServiceClient.send<UserTakeAdminRoleResponse>(
        Pattern.USER_TAKE_ADMIN,
        { ...takeAdminDto },
      );

    const takeAdminData = await lastValueFrom(takeAdminResponse);

    if (!takeAdminData.error) {
      throw new InternalServerErrorException(takeAdminData.error);
    }

    return {
      ...takeAdminData,
      status: HttpStatus.ACCEPTED,
    };
  }
}
