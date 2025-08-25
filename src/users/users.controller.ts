import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './schema/user.schema';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDTO): Promise<string> {
    await this.userService.create(createUserDto);
    return 'User Created Successfully';
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
