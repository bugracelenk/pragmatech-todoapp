import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserLoginDto } from '../dtos/auth.login.dto';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userArgs: UserCreateDto): Promise<User> {
    const password = await bcrypt.hash(userArgs.password, 10);
    userArgs.password = password;

    const newUser = new this.userModel(userArgs);
    return await newUser.save();
  }

  async getUserByEmail(loginArgs: UserLoginDto): Promise<User> {
    return await this.userModel.findOne({ email: loginArgs.email });
  }
}
