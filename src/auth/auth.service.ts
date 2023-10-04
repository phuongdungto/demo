import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import {
  UserForgotPWDto,
  UserSiginDto,
  UserSigupDto,
  resetPasswordDto,
} from './auth.dto';
import { User } from 'src/user/user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, MoreThanOrEqual } from 'typeorm';
import { Role } from 'src/core/enum';
import { Token } from './token.entity';
import { TokenGenerator } from 'ts-token-generator';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Token) private tokenRepo: Repository<Token>,
    private configService: ConfigService,
    private mailService: MailService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
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

  async signup(body: UserSigupDto) {
    const user = await this.userRepo.findOne({
      where: { username: body.username },
    });
    if (user) {
      throw new BadRequestException('username is already exists');
    }
    const userUpdate = new User();

    Object.assign(userUpdate, body);
    userUpdate.role = Role.USER;
    const newUser = await this.userRepo.save(userUpdate);
    return newUser;
  }

  async forgotPassword(body: UserForgotPWDto) {
    const user = await this.userRepo.findOne({
      where: { username: body.username },
    });
    const tokgen = new TokenGenerator();
    tokgen.generate();
    if (!user) {
      throw new NotFoundException('User with given email does not exist');
    }
    const token = await this.tokenRepo.save({
      userId: user.id,
      token: tokgen._baseEncoding,
      expiredAt: new Date(
        Date.now() + +this.configService.get('EXPIRED_RESET_PASSWORD_TOKEN'),
      ),
      type: 'forgot-password',
    });
    const resetPasswordLink = `${this.configService.get(
      'WEB_FORGOT_PASSWORD_URL',
    )}/${user.id}/${token.token}`;

    this.mailService
      .sendMail({
        email: user.username,
        subject: 'Password reset',
        template: 'reset-password',
        context: { resetPasswordLink },
      })
      .catch((error) => console.log(error));
  }

  async resetPassword(body: resetPasswordDto) {
    const user = await this.userRepo.findOne({ where: { id: body.id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const token = await this.tokenRepo.findOne({
      where: {
        userId: user.id,
        token: body.token,
        expiredAt: MoreThanOrEqual(new Date()),
        type: 'forgot-password',
      },
    });
    if (!token) {
      throw new BadRequestException('Invalid link or expired');
    }
    await this.entityManager.transaction(async (transactionEntity) => {
      user.password = body.password;
      await transactionEntity.save(user);
      await transactionEntity
        .createQueryBuilder()
        .delete()
        .from(Token)
        .where('user_id=:id', { id: user.id })
        .execute();
    });
  }
}
