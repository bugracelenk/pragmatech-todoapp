import { ApiProperty } from '@nestjs/swagger';

class DefaultResponse {
  @ApiProperty({
    example: 'Success',
    description: 'Message returned from microservice',
    required: false,
  })
  message?: string;

  @ApiProperty({
    example: 200,
    description: 'Status code returned from microservice',
    required: false,
  })
  status?: number;

  @ApiProperty({
    example: 'User update failed!',
    description: 'Error code returned from microservice',
    required: false,
  })
  error?: string;
}

export class UserLoginResponse extends DefaultResponse {
  @ApiProperty({
    example: 'JWT_TOKEN!',
    description: 'jwt token returned from user microservice for authorization',
    required: true,
  })
  token: string;
}

export class UserRegisterResponse extends DefaultResponse {
  @ApiProperty({
    example: 'JWT_TOKEN!',
    description: 'jwt token returned from user microservice for authorization',
    required: true,
  })
  token: string;
}

export class UserUpdateResponse extends DefaultResponse {
  @ApiProperty({
    example: '6174a459dfaa356068f4b951',
    description: 'jwt token returned from user microservice for authorization',
    required: true,
  })
  id?: string;
}

export class UserForgotPasswordResponse extends DefaultResponse {
  @ApiProperty({
    example: '123456',
    description: 'could be changed in the future',
    required: true,
  })
  token?: string;
}

export class UserChangePasswordResponse extends DefaultResponse {}

export class UserBanUserResponse extends DefaultResponse {
  @ApiProperty({
    example: '6174a459dfaa356068f4b951',
    description: 'Banned users id',
    required: true,
  })
  id?: string;
  @ApiProperty({
    example: 'Bad interest in the system.',
    description: 'Ban reason',
    required: true,
  })
  banReason?: string;
}

export class UserGrantAdminRoleResponse extends DefaultResponse {
  @ApiProperty({
    example: '6174a459dfaa356068f4b951',
    description: 'Banned users id',
    required: true,
  })
  id?: string;
}

export class UserTakeAdminRoleResponse extends UserGrantAdminRoleResponse {}
