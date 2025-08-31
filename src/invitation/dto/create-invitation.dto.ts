import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInvitationDto {
  @IsString()
  @IsNotEmpty()
  inviteeUserId: string;

  @IsString()
  @IsNotEmpty()
  familyId: string;

  @IsString()
  @IsNotEmpty()
  invitedBy: string;
}