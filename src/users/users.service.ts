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

  async createUser(createUserDto: CreateUserDTO) {
    const existingUser = await this.findUserByPhone(createUserDto.phone_number);

    if (existingUser) {
      throw new BadRequestException(
        'User With This Phone Number Already Exists',
      );
    }
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const createdUser = new this.userModel(createUserDto);
      await createdUser.save({ session });
      await session.commitTransaction();
      return 'User Created Successfully';
    } catch (error) {
      await session.abortTransaction();

      // Re-throw HttpExceptions as is
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Otherwise, wrap the error nicely
      throw new BadRequestException(
        error.message || 'An error occurred while creating the user',
      );
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

  async findUserByPhone(phoneNumber: string) {
    return this.userModel.findOne({ phoneNumber }).exec();
  }

  async findAllUsers(): Promise<User[]> {
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
        .session(session)
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
      const deletedUser = await this.userModel
        .findByIdAndDelete(id)
        .session(session)
        .exec();
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

  async isUserInFamily(id: string): Promise<boolean> {
    const user = await this.findUserById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.family_id !== null && user.family_id !== undefined) {
      return true;
    }
    return false;
  }

  async addUserToFamily(userId: string, familyId: string) {
    return this.updateUser(userId, { family_id: familyId });
  }

  async removeUserFromFamily(userId: string) {
    return this.updateUser(userId, { family_id: null });
  }
}
