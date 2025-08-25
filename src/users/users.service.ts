import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDTO): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findUserById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID Is Not Valid');
    }
    return this.userModel.findById(id).exec();
  }

  async findUserByPhone(phone_number: string) {
    return this.userModel.findOne({ phone_number }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
