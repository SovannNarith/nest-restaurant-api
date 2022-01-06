import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './filters/mongo-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  // app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('v1');

  await app.listen(3000);
}
bootstrap();
