import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schemas/user.schema';
import * as mongoose from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'FamilyMember', schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule, UserService],
})
export class UserModule {}
