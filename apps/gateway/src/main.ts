import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('GATEWAY_PORT');
  await app.listen(port);
  Logger.log(`🚀 Yape Challenge 🚀 is running on: http://localhost:${port}`);
}
bootstrap();
