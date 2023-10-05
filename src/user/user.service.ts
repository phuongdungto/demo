import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { createUserDto, getusersDto, updateUserDto } from './user.dto';
import { Pagination } from '../core/utils/pagination.ultis';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(user: createUserDto): Promise<User> {
    const exist = await this.userRepo.findOne({
      where: { fullname: user.fullname },
    });
    if (exist) {
      throw new BadRequestException('user already exists');
    }
    // user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
    const newUser = await this.userRepo.save(user);
    return newUser;
  }

  async getUser(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(userId: number, body: updateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    console.log(body);
    if (user.image !== 'default-avatar.jpg') {
      if (user.image) {
        fs.unlink(join(__dirname, '../../public/avatar', user.image)).catch(
          (error) => console.log(error),
        );
      }
    }
    Object.assign(user, body);
    const newUser = await this.userRepo.save(user);
    return newUser;
  }

  async deleteUser(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.userRepo.delete(userId);
  }

  async getUsers(input: getusersDto) {
    const query = Pagination(User, input);
    const [rows, count] = await this.userRepo.findAndCount({
      ...query,
    });
    return { users: rows, totalPage: count };
  }
}
