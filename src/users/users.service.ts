import { Connection, Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { isValidObjectId } from 'mongoose';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDTO) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const createdUser = new this.userModel(createUserDto);
      await createdUser.save();
      await session.commitTransaction();
      return 'User Created Successfully';
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
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

  async updateUser(id: string, updateUserDto: UpdateUserDTO) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID is not valid');
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true }) // {new:true} ensures that the updated user is returned
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await session.commitTransaction();
      return updatedUser;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async deleteUser(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID Is Not Valid');
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        // no user with this id
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      await session.commitTransaction();
      return 'Deleted User Successfully';
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
