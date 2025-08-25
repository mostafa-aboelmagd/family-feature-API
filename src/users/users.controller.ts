import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './schema/user.schema';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

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

    await this.usersService.create(createUserDto);
    return 'User Created Successfully';
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<User> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
