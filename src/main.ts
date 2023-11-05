import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get<string>('express.port'));
}
bootstrap();
