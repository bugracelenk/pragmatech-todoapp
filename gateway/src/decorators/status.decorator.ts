import { SetMetadata } from '@nestjs/common';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
}

export const STATUS_KEY = 'userStatus';
export const UserStatuses = (...userStatus: UserStatus[]) =>
  SetMetadata(STATUS_KEY, userStatus);
