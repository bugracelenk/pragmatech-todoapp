import { MailContext } from 'src/types/context.type';
import { MailType } from 'src/types/mail.enum';
import { MailParamsDto } from 'src/types/mail.params.dto';

export function returnContext(data: MailParamsDto): Partial<MailContext> {
  switch (data.mailType) {
    case MailType.FORGOT_PASSWORD:
      return {
        url: data.url,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
      };
    case MailType.CONFIRMATION:
      return {
        url: data.url,
        email: data.user.email,
      };
  }
}
