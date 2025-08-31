import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
