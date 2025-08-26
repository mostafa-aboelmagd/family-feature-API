import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class AddMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(['provider', 'parent', 'Child'])
  role: 'provider' | 'parent' | 'Child';
}