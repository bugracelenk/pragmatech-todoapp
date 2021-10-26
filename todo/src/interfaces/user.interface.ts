export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  resetPasswordToken: string;
  rptExpires: Date;
  userType: string;
  userStatus: string;
  banReason: string;
  firstName: string;
  lastName: string;
  profileImage: string;
}
