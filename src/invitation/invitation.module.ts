import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';


import { MongooseModule } from '@nestjs/mongoose';
import { InvitationSchema } from '../schemas/invitation.schema';
import { UserModule } from '../user/user.module';
import { FamilyModule } from '../family/family.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Invitation', schema: InvitationSchema }]),
    UserModule,
    FamilyModule,
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
