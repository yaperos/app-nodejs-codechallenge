import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';

import { Logger } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('MS_TRANSACTION');
  const port = parseInt(process.env.MSTRANSACTION_PORT, 10);
  const host = process.env.MSTRANSACTION_HOST;

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await app.listen(host);

  logger.log(`Server listening on port ${port} and host ${host}`);
}
bootstrap();
