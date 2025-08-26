import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FamilyModule } from './family/family.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://dbAdmin:f3qondCkJ6ratpvL@familyfeaturedb.kkbgx5x.mongodb.net/'),
    UserModule, FamilyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

