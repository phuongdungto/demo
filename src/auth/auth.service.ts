import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { UserSiginDto } from './auth.dto';
import { User } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async signIn(body: UserSiginDto) {
    const user = await this.userRepo.findOne({
      where: { username: body.username, password: body.password },
    });
    if (!user) {
      throw new BadRequestException('username or password is incorrect');
    }
    const payload = { sub: user.id, username: user.username, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      user: user,
      access_token,
    };
  }
}
