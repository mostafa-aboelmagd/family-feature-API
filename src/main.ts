import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // convert plain -> DTO class instances
      whitelist: true, // strip properties that are not in the DTO
      forbidNonWhitelisted: true, // throw if unknown properties are present
      stopAtFirstError: false, // optional: collect all validation errors
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
