import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FamilySchema } from '../schemas/family.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Family', schema: FamilySchema }]),
    UserModule,
  ],
  controllers: [FamilyController],
  providers: [FamilyService],
  exports: [FamilyService],
})
export class FamilyModule {}
