import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailParamsDto } from './types/mail.params.dto';
import { Subject, Template } from './types/mail.enum';
import { returnContext } from './helpers/return-context';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(data: MailParamsDto) {
    try {
      const context = returnContext(data);
      await this.mailerService.sendMail({
        to: data.user.email,
        subject: Subject[data.mailType],
        template: Template[data.mailType],
        context,
      });
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
