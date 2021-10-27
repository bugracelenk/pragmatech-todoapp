import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { UserStatus, UserType } from "../user.enum";

/**
 * User Model:
 * username: string,
 * email: string,
 * password: string,
 * resetPasswordToken: string,
 * rptExpires: Date,
 * userType: UserType,
 * userStatus: UserStatus,
 * banReason: string,
 * firstName: string,
 * lastName: string,
 * profileImage: string,
 * teams: [Team],
 * todos: [Todo] // Contains all the private and assigned todos,
 * createdAt: Date,
 * updatedAt: Date
 */

export type UserDocument = User & mongoose.Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  id: string;
  @Prop({
    required: true,
    match: /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
    unique: true,
  })
  username: string;
  @Prop({
    required: true,
    match:
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    unique: true,
  })
  email: string;
  @Prop({
    required: true,
  })
  password: string;
  @Prop({
    default: "",
  })
  resetPasswordToken: string;
  @Prop({
    default: Date.now(),
  })
  rptExpires: Date;
  @Prop({
    default: "USER",
    enum: UserType,
  })
  userType: UserType;
  @Prop({
    default: "ACTIVE",
    enum: UserStatus,
  })
  userStatus: UserStatus;
  @Prop({
    default: "",
  })
  banReason: string;
  @Prop({
    required: true,
    match: /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/,
  })
  firstName: string;
  @Prop({
    required: true,
    match: /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/,
  })
  lastName: string;
  @Prop({
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  })
  profileImage: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Todo",
    default: [],
  })
  todos: [string | mongoose.Schema.Types.ObjectId];
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    default: [],
  })
  teams: [string | mongoose.Schema.Types.ObjectId];
}

export const UserSchema = SchemaFactory.createForClass(User);
