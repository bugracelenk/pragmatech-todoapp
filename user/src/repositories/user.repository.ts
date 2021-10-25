import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { UserChangePasswordDto } from "../dtos/user.changePassword.dto";
import { UserUpdateDto } from "../dtos/user.update.dto";
import { User, UserDocument } from "../schemas/user.schema";
import { UserStatus, UserType } from "../user.enum";

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: mongoose.Model<UserDocument>) {}

  async updateUserById(id: string, updateArgs: UserUpdateDto): Promise<User> {
    const objId = new mongoose.Types.ObjectId(id);
    return await this.userModel.findByIdAndUpdate(
      objId,
      {
        $set: { ...updateArgs },
      },
      { new: true }
    );
  }

  async changePasswordRequest(email: string, resetPasswordToken: string): Promise<User> {
    return await this.userModel.findOneAndUpdate(
      { email },
      {
        $set: {
          resetPasswordToken,
          rptExpires: new Date(Date.now() + 86400000),
        },
      }
    );
  }

  async changeUserPassword(changePasswordArgs: UserChangePasswordDto): Promise<User> {
    return await this.userModel.findOneAndUpdate(
      {
        email: changePasswordArgs.email,
        resetPasswordToken: changePasswordArgs.resetPasswordToken,
        rptExpires: { $gt: new Date(Date.now()) },
      },
      {
        $set: {
          password: changePasswordArgs.password,
          resetPasswordToken: "",
          rptExpires: new Date(Date.now()),
        },
      },
      { new: true }
    );
  }

  async banUserById(id: string, banReason: string): Promise<User> {
    const objId = new mongoose.Types.ObjectId(id);
    return await this.userModel.findByIdAndUpdate(
      objId,
      {
        $set: { banReason, userStatus: UserStatus.BANNED },
      },
      { new: true }
    );
  }

  async grantAdminRole(id: string): Promise<User> {
    const objId = new mongoose.Types.ObjectId(id);
    return await this.userModel.findByIdAndUpdate(
      objId,
      {
        $set: { userType: UserType.ADMIN },
      },
      { new: true }
    );
  }

  async takeAdminRole(id: string): Promise<User> {
    const objId = new mongoose.Types.ObjectId(id);
    return await this.userModel.findByIdAndUpdate(
      objId,
      {
        $set: { userType: UserType.USER },
      },
      { new: true }
    );
  }

  async getUserById(id: string): Promise<User> {
    const objId = new mongoose.Types.ObjectId(id);
    return await this.userModel.findById(id).select("-__v -password -rptExpires -resetPasswordToken");
  }
}
