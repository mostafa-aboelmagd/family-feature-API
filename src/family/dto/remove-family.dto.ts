import { IsString, IsNotEmpty } from 'class-validator';

export class RemoveFamilyDto {
  @IsString()
  @IsNotEmpty()
  requestingUserId: string;
}