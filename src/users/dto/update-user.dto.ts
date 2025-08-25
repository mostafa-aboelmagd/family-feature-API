/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {} // Extends the create-user-DTO but all the fields are optional
