import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Not strictly needed if isGlobal: true, but good practice
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('DATABASE_ADMIN')}:${configService.get('DATABASE_PASSWORD')}@familyfeaturedb.kkbgx5x.mongodb.net/?retryWrites=true&w=majority&appName=familyFeatureDB`,
      }),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
