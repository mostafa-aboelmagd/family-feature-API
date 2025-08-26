import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';

import { Family } from './interfaces/family.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../user/interfaces/user.interface';
import { AddMemberDto } from './dto/add-member.dto';
import { RemoveMemberDto } from './dto/remove-member.dto';
@Injectable()
export class FamilyService {

  constructor(
    @InjectModel('FamilyMember') private readonly userModel: Model<User>,
    @InjectModel('Family') private readonly familyModel: Model<Family>,
  ) {}

  async createFamily(creatorUserId: string): Promise<Family> {
    const creator = await this.userModel.findById(creatorUserId).exec();
    if (!creator) {
      throw new BadRequestException('Creator user not found');
    }
    if (creator.familyId) {
      throw new BadRequestException('Creator is already in a family');
    }

    const newFamily = new this.familyModel({
      members: [
        {
          userId: creatorUserId,
          role: 'provider',
          permissions: ['add_member', 'remove_member', 'remove_family'],
        },
      ],
    });
    await newFamily.save();

    creator.familyId = newFamily._id;
    creator.familyRole = 'provider';
    creator.familyPermissions = ['add_member', 'remove_member', 'remove_family'];
    await creator.save();

    return newFamily;
  }

  async addMember(familyId: string, addMemberDto: AddMemberDto): Promise<Family> {
    const family = await this.familyModel.findById(familyId).exec();
    if (!family) {
      throw new BadRequestException('Family not found');
    }

    const user = await this.userModel.findById(addMemberDto.userId).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.familyId) {
      throw new BadRequestException('User is already in a family');
    }

    family.members.push({
      userId: addMemberDto.userId,
      role: addMemberDto.role,
      permissions: [],
    });
    await family.save();

    user.familyId = family._id;
    user.familyRole = addMemberDto.role;
    user.familyPermissions = [];
    await user.save();

    return family;
  }

  async removeMember(familyId: string, removeMemberDto: RemoveMemberDto): Promise<Family> {
    const family = await this.familyModel.findById(familyId).exec();
    if (!family) {
      throw new BadRequestException('Family not found');
    }

    const user = await this.userModel.findById(removeMemberDto.userId).exec();
    if (!user || user.familyId?.toString() !== familyId) {
      throw new BadRequestException('User not in this family');
    }

    family.members = family.members.filter(member => member.userId.toString() !== removeMemberDto.userId);
    await family.save();

    user.familyId = null;
    user.familyRole = null;
    user.familyPermissions = [];
    await user.save();

    return family;
  }

  async removeFamily(familyId: string, requestingUserId: string): Promise<void> {
    const family = await this.familyModel.findById(familyId).exec();
    if (!family) {
      throw new BadRequestException('Family not found');
    }

    const requestingUser = await this.userModel.findById(requestingUserId).exec();
    if (!requestingUser) {
      throw new BadRequestException('Requesting user not found');
    }

    const familyMember = family.members.find(member => member.userId.toString() === requestingUserId);
    if (!familyMember || familyMember.role !== 'provider' || !familyMember.permissions.includes('remove_family')) {
      throw new ForbiddenException('Only the provider can delete the family');
    }

    await this.userModel.updateMany(
      { familyId: family._id },
      { $set: { familyId: null, familyRole: null, familyPermissions: [] } },
    ).exec();

    await this.familyModel.deleteOne({ _id: familyId }).exec();
  }

  async getFamily(familyId: string): Promise<Family> {
    const family = await this.familyModel.findById(familyId).populate('members.userId').exec();
    if (!family) {
      throw new NotFoundException(`Family with ID ${familyId} not found`);
    }
    return family;
  }

}
