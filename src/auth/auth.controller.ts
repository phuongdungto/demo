import { Controller, Body, Res, Next, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  UserForgotPWDto,
  UserSiginDto,
  UserSigupDto,
  resetPasswordDto,
} from './auth.dto';
import { Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

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

  @Post('signup')
  async signUp(
    @Body() body: UserSigupDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const user = await this.authService.signup(body);
      return res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: UserForgotPWDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      await this.authService.forgotPassword(body);
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }

  @Post('password-reset')
  async resetPassword(
    @Body() body: resetPasswordDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      await this.authService.resetPassword(body);
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
}
