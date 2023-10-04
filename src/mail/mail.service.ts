import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
import * as fsPromises from 'fs/promises';
import Handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendMail({ email, subject, template, context }) {
    console.log(join(__dirname, `../../email_templates`, `${template}.hbs`));
    const htmlString = await fsPromises.readFile(
      join(__dirname, `../../email_templates`, `${template}.hbs`),
    );
    // console.log(htmlString.toString('utf8'));
    const templateComplie = Handlebars.compile(htmlString.toString('utf8'));
    const html = templateComplie(context);
    this.mailService.sendMail({
      from: this.configService.get('EMAIL_AUTH_USER'),
      to: email,
      subject: subject,
      html,
    });
  }
}
