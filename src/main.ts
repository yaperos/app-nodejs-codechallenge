import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { microServiceKafka } from './config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(microServiceKafka);
  const configService = app.get(ConfigService);

  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get<string>('express.port'));
}
bootstrap();
