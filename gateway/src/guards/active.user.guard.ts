import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { STATUS_KEY, UserStatus } from '../decorators/status.decorator';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class ActiveStatusGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserStatus[]>(
      STATUS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user }: { user: IUser } = context.switchToHttp().getRequest();

    return requiredRoles.some((status) => user.userStatus?.includes(status));
  }
}
