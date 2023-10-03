import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization;
      if (!token || !token.startsWith('Bearer')) {
        throw new UnauthorizedException('Token schema is invalid or missing');
      }
      const accessToken = token.replace('Bearer ', '');
      const user = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('JWT_SECRET'),
      });
      request['user'] = user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return true;
  }
}
