import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';

@Controller('invitation')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  create(@Body() createInvitationDto: CreateInvitationDto) {
    return this.invitationService.create(createInvitationDto);
  }

}
