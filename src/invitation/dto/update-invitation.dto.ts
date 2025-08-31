import { PartialType } from '@nestjs/mapped-types';
import { CreateInvitationDto } from './create-invitation.dto';

import { IsString, IsIn } from 'class-validator';

export class UpdateInvitationDto {
  @IsString()
  @IsIn(['accepted', 'rejected'])
  status: string;
}