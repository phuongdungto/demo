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
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { createUserDto, getusersDto, updateUserDto } from './user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  FilterImage,
  destination,
  filename,
} from '../core/static/image.static';

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
  @UseGuards(AuthGuard)
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: destination,
        filename: filename,
      }),
      fileFilter: FilterImage,
    }),
  )
  async updateUser(
    @Param('id') userId: number,
    @Body() body: updateUserDto,
    @Res() res: Response,
    @Next() next: NextFunction,
    @UploadedFile() file: any,
  ) {
    try {
      const newBody = {
        ...body,
        image: file.filename,
      };
      const newUser = await this.userService.updateUser(userId, newBody);
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

  @Get()
  async getUsers(
    @Query() input: getusersDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      console.log(input);
      const users = await this.userService.getUsers(input);
      return res.status(200).send(users);
    } catch (error) {
      next(error);
    }
  }
}
