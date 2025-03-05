import {Controller, Get} from '@nestjs/common';
import {MailService} from './mail.service';
import {Public, ResponseMessage} from 'src/decorator/customize';
import {MailerService} from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
  ) {}

  @ResponseMessage('Test email')
  @Get()
  @Public()
  async handleTestEmail() {
    await this.mailerService.sendMail({
      to: 'viethoangkxtb@gmail.com',
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'job',
    });
  }
}
