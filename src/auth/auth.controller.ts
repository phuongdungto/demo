import { Controller, Body, Res, Next, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSiginDto } from './auth.dto';
import { Response, NextFunction } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(
    @Body() body: UserSiginDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const user = await this.authService.signIn(body);
      return res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }
}
