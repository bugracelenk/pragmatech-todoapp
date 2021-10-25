import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MailService } from './app.service';
import { MailResponse } from './types/mail-response.type';
import { MailParamsDto } from './types/mail.params.dto';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern('SEND_MAIL')
  async sendMail(data: MailParamsDto): Promise<MailResponse> {
    await this.mailService.sendMail(data);

    return {
      status: HttpStatus.ACCEPTED,
      message: 'MAIL_SEND_SUCCESSFULLY',
    };
  }
}
