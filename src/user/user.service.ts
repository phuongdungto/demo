import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { createUserDto, getusersDto, updateUserDto } from './user.dto';
import { Pagination } from '../core/utils/pagination.ultis';
import * as fs from 'fs/promises';
import { join } from 'path';
import { ReqUser } from '../core/interface/user.interface';
import { Role } from '../core/enum';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(user: createUserDto): Promise<User> {
    const exist = await this.userRepo.findOne({
      where: { username: user.username },
    });
    if (exist) {
      throw new BadRequestException('user already exists');
    }
    // user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
    const newUser = await this.userRepo.save(user);
    delete newUser.password;
    return newUser;
  }

  async getUser(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete user.password;
    return user;
  }

  async updateUser(
    userId: any,
    signin: ReqUser,
    body: updateUserDto,
  ): Promise<User> {
    let user = new User();
    if (userId !== 'me') {
      user = await this.userRepo.findOne({ where: { id: userId } });
    } else {
      user = await this.userRepo.findOne({ where: { id: signin.sub } });
    }
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (signin.role === Role.USER && signin.sub !== user.id) {
      throw new ForbiddenException();
    }
    if (user.image !== 'default-avatar.jpg') {
      if (body.image) {
        fs.unlink(join(__dirname, '../../public/avatar', user.image)).catch(
          (error) => console.log(error),
        );
      }
    }
    console.log(body);
    Object.assign(user, body);
    const newUser = await this.userRepo.save(user);
    delete newUser.password;
    return newUser;
  }

  async deleteUser(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.userRepo.softDelete(userId);
  }

  async getUsers(input: getusersDto) {
    const query = Pagination(User, input);
    const [rows, count] = await this.userRepo.findAndCount({
      ...query,
    });
    return { users: rows, totalPage: Math.ceil(count / input.limit) };
  }
}
