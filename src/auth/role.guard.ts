import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '../core/enum';

@Injectable()
export class RolesGuard implements CanActivate {
  //   constructor(private reflector: Reflector) {}
  private roles: Role[];
  constructor(roles: Role[]) {
    this.roles = roles;
  }

  canActivate(context: ExecutionContext): boolean {
    // const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    if (!this.roles.length) {
      return true;
    }
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
