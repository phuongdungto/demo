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
  ParseFilePipe,
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
import { RolesGuard } from 'src/auth/role.guard';
import { Role } from 'src/core/enum';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: destination,
        filename: filename,
      }),
      fileFilter: FilterImage,
    }),
  )
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  async createUser(
    @Body() body: createUserDto,
    @Res() res: Response,
    @Next() next: NextFunction,
    @UploadedFile() file: any,
  ) {
    try {
      let newBody = body;
      if (file) {
        newBody = {
          ...body,
          image: file.filename,
        };
      }
      const user = await this.userService.createUser(newBody);
      return res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  }

  @Get(':id')
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
    FileInterceptor('image', {
      storage: diskStorage({
        destination: destination,
        filename: filename,
      }),
      fileFilter: FilterImage,
    }),
  )
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN, Role.USER]))
  async updateUser(
    @Param('id') userId: any,
    @Body() body: updateUserDto,
    @Res() res: Response,
    @Req() req: Request,
    @Next() next: NextFunction,
    @UploadedFile() file: any,
  ) {
    try {
      console.log(file);
      let newBody = body;
      if (file) {
        newBody = {
          ...body,
          image: file.filename,
        };
      }

      const signin = req['user'];
      const newUser = await this.userService.updateUser(
        userId,
        signin,
        newBody,
      );
      return res.status(200).send(newUser);
    } catch (error) {
      next(error);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
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
