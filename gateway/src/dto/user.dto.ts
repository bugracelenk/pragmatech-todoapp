import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import * as Messages from '../utilities/messages.data';

export class UserLoginDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Users email',
    required: true,
  })
  @IsNotEmpty({ message: Messages.notEmpty('email') })
  @IsEmail(
    { allow_display_name: true },
    { message: Messages.notValid('email') },
  )
  email: string;

  @ApiProperty({
    example: '1234567890*',
    description: 'Users password',
    required: true,
  })
  @IsNotEmpty({ message: Messages.notEmpty('password') })
  password: string;
}

export class UserRegisterDto {
  @ApiProperty({
    example: '6174a459dfaa356068f4b951',
    description: 'ObjectId - Auto generated',
    required: false,
  })
  id: string;

  @ApiProperty({
    example: 'someusername',
    description: 'Username field',
    required: true,
  })
  @IsNotEmpty({ message: Messages.notEmpty('username') })
  @MinLength(8, { message: Messages.minLength('username', 8) })
  @MaxLength(20, { message: Messages.maxLength('username', 20) })
  @Matches(/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/, {
    message: Messages.notValid('username'),
  })
  username: string;

  @ApiProperty({
    example: 'someusername@example.com',
    description: 'email address field',
    required: true,
  })
  @IsNotEmpty({ message: Messages.notEmpty('email') })
  @IsEmail(
    { allow_display_name: true },
    { message: Messages.notValid('email') },
  )
  email: string;

  @ApiProperty({
    example: '1234687987',
    description: 'Password - Will be crypted before save',
    required: true,
  })
  @IsNotEmpty({ message: Messages.notEmpty('password') })
  @MinLength(8, { message: Messages.minLength('password', 12) })
  password: string;

  @ApiProperty({
    example: 'Jhon',
    description: 'User first name',
    required: true,
  })
  @IsNotEmpty({ message: Messages.notEmpty('first name') })
  @Matches(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/, {
    message: Messages.notValid('first name'),
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    required: true,
  })
  @IsNotEmpty({ message: Messages.notEmpty('last name') })
  @Matches(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/, {
    message: Messages.notValid('last name'),
  })
  lastName: string;

  @ApiProperty({
    example: 'https://google.com',
    description: 'User profile image',
    required: true,
  })
  profileImage: string;
}

export class UserUpdateDto {
  profileImage?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export class UserChangePasswordDto {
  @IsNotEmpty({ message: Messages.notEmpty('email') })
  @IsEmail(
    { allow_display_name: true },
    { message: Messages.notValid('email') },
  )
  email: string;

  @IsNotEmpty({ message: Messages.notEmpty('reset token') })
  resetPasswordToken: string;

  @IsNotEmpty({ message: Messages.notEmpty('password') })
  password: string;
}

export class UserBanUserDto {
  @IsNotEmpty({ message: Messages.notEmpty('id') })
  @IsMongoId({ message: Messages.notValid('id', 'ObjectId') })
  id: string;

  @IsOptional()
  @IsString()
  banReason: string;
}

export class UserGrantAdminDto {
  @IsNotEmpty({ message: Messages.notEmpty('id') })
  @IsMongoId({ message: Messages.notValid('id', 'ObjectId') })
  id: string;
}

export class UserTakeAdminDto {
  @IsNotEmpty({ message: Messages.notEmpty('id') })
  @IsMongoId({ message: Messages.notValid('id', 'ObjectId') })
  id: string;
}
