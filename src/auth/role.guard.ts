import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '../core/enum';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY, Roles } from './role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  //   constructor(private reflector: Reflector) {}
  constructor(
    private roles: Role[],
    private anonymous?: string,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    // console.log(requiredRoles);
    // if (!requiredRoles) {
    //   return true;
    // }
    // const roles = this.reflector.get('roles', context.getHandler());
    // console.log(roles);
    // if (!this.roles.length) {
    //   return true;
    // }
    const request = context.switchToHttp().getRequest();
    if (
      this.roles.length &&
      !this.roles.some((role) => role === request['user'].role)
    ) {
      throw new ForbiddenException();
    }
    return true;
  }
}
