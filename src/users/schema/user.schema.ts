import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
//import { Family } from '../family/schema/family.schema';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true, unique: true })
  phone_number: string;

  @Prop({ required: true, unique: true })
  email: string;

  // inside the class definition
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: false,
    default: null,
  })
  family_id: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
