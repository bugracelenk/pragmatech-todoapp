import { MailType } from './mail.enum';
import { User } from './user.type';

export type MailParamsDto = {
  user: User;
  token: string;
  url?: string;
  mailType: MailType;
};
