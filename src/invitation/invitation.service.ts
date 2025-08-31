import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invitation } from './interfaces/invitation.interface';
import { UserService } from '../user/user.service';
import { FamilyService } from '../family/family.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class InvitationService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel('Invitation') private readonly invitationModel: Model<Invitation>,
    private readonly userService: UserService,
    private readonly familyService: FamilyService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async create(createInvitationDto: CreateInvitationDto): Promise<Invitation> {
    const { inviteeUserId, familyId, invitedBy } = createInvitationDto;

    const inviter = await this.userService.findOne(invitedBy);
    if (!inviter) {
      throw new BadRequestException('Inviter not found');
    }
    if (!inviter.familyId || inviter.familyId.toString() !== familyId || inviter.familyRole !== 'provider') {
      throw new ForbiddenException('Only family provider can send invitations');
    }

    const family = await this.familyService.getFamily(familyId);
    if (!family) {
      throw new BadRequestException('Family not found');
    }

    const invitee = await this.userService.findOne(inviteeUserId);
    if (!invitee) {
      throw new BadRequestException('Invitee not found');
    }
    if (invitee.familyId) {
      throw new BadRequestException('Invitee is already in a family');
    }

 
    const invitation = new this.invitationModel({
      email: invitee.email,
      familyId,
      invitedBy,
      status: 'pending' as const,
    });
    await invitation.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: invitee.email,
      subject: 'Family Invitation',
      text: `You have been invited to join ${inviter.firstName}'s family. Click here to accept: http://localhost:3000/invitation/${invitation._id}/accept`,
    };
    await this.transporter.sendMail(mailOptions);

    return invitation;
  }


  async update(id: string, updateInvitationDto: UpdateInvitationDto, userId: string): Promise<Invitation> {
    const invitation = await this.invitationModel.findById(id).exec();
    if (!invitation) {
      throw new BadRequestException('Invitation not found');
    }
    if (invitation.status !== 'pending') {
      throw new BadRequestException('Invitation is no longer pending');
    }

    const user = await this.userService.findOne(userId);
    if (!user || user.email !== invitation.email) {
      throw new ForbiddenException('Only the invited user can update the invitation');
    }

    invitation.status = updateInvitationDto.status as 'accepted' | 'rejected';
    await invitation.save();

    if (updateInvitationDto.status === 'accepted') {
      await this.familyService.addMember(invitation.familyId.toString(), {
        userId: userId,
        role: 'Child',
      });
    }

    return invitation;
  }
}