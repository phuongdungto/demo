import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import 'dotenv/config';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        transport: {
          host: process.env.EMAIL_HOST,
          secure: false,
          auth: {
            user: process.env.EMAIL_AUTH_USER,
            pass: process.env.EMAIL_AUTH_PASS,
          },
        },
        defaults: {
          from: `"No Reply"<${process.env.EMAIL_AUTH_USER}>`,
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
