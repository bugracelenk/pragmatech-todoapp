import { IsMongoId, IsNotEmpty } from 'class-validator';
import * as Messages from '../utilities/messages.data';

export class GetIdDto {
  @IsNotEmpty({ message: Messages.notEmpty('id') })
  @IsMongoId({ message: Messages.notValid('id', 'ObjectId') })
  id: string;
}
