import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './schema/user.schema';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDTO): Promise<string> {
    const existingUser = await this.usersService.findUserByPhone(
      createUserDto.phone_number,
    );

    if (existingUser) {
      throw new ConflictException('Phone number already registered');
    }

    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findUser(@Param('id', ParseObjectIdPipe) id: string): Promise<User> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDTO);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
