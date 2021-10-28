class DefaultResponse {
  message?: string;
  status?: number;
  error?: string;
}

export class UserLoginResponse extends DefaultResponse {
  token: string;
}

export class UserRegisterResponse extends DefaultResponse {
  token: string;
}

export class UserUpdateResponse extends DefaultResponse {
  id?: string;
}

export class UserForgotPasswordResponse extends DefaultResponse {
  token?: string;
}

export class UserChangePasswordResponse extends DefaultResponse {}

export class UserBanUserResponse extends DefaultResponse {
  id?: string;
  banReason?: string;
}

export class UserGrantAdminRoleResponse extends DefaultResponse {
  id?: string;
}

export class UserTakeAdminRoleResponse extends UserGrantAdminRoleResponse {}
