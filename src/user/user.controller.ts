import {
  Controller,
  Get,
  Post,
  Delete,
  Res,
  Body,
  Next,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { createUserDto, updateUserDto } from './user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from '../core/enum';
import { RolesGuard } from '../auth/role.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(
    @Body() body: createUserDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const user = await this.userService.createUser(body);
      return res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  async getUser(
    @Param('id') userId: number,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Req() req: Request,
  ) {
    try {
      console.log(req['user']);
      const user = await this.userService.getUser(userId);
      return res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') userId: number,
    @Body() body: updateUserDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const newUser = await this.userService.updateUser(userId, body);
      return res.status(200).send(newUser);
    } catch (error) {
      next(error);
    }
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: number,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      await this.userService.deleteUser(id);
      return res.status(200).send({
        code: 'SUCESS',
        message: 'deleted user successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
