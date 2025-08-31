/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
import { IsOptional, IsMongoId } from 'class-validator';

// Extends the create-user-DTO but all the create-user fields are optional
export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsOptional()
  @IsMongoId()
  family_id?: string | null;   // optional, can be sent or omitted
}
