import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';

import { AddMemberDto } from './dto/add-member.dto';
import { RemoveMemberDto } from './dto/remove-member.dto';
import { RemoveFamilyDto } from './dto/remove-family.dto';

@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Post('create/:creatorUserId')
  async createFamily(@Param('creatorUserId') creatorUserId: string) {
    return this.familyService.createFamily(creatorUserId);
  }

  @Post(':familyId/add-member')
  async addMember(@Param('familyId') familyId: string, @Body() addMemberDto: AddMemberDto) {
    return this.familyService.addMember(familyId, addMemberDto);
  }

  @Post(':familyId/remove-member')
  async removeMember(@Param('familyId') familyId: string, @Body() removeMemberDto: RemoveMemberDto) {
    return this.familyService.removeMember(familyId, removeMemberDto);
  }
  @Post(':familyId/remove-family')
  async removeFamily(@Param('familyId') familyId: string, @Body() removeFamilyDto: RemoveFamilyDto) {
    return this.familyService.removeFamily(familyId, removeFamilyDto.requestingUserId);
  }

  @Get(':familyId')
  async getFamily(@Param('familyId') familyId: string) {
    return this.familyService.getFamily(familyId);
  }

}
