import { NestFactory } from '@nestjs/core';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';
import { MicroserviceOptions } from '@nestjs/microservices';

import * as dotenv from 'dotenv';

import { Logger } from '@nestjs/common';
import { kafkaConfig } from './utils/kafka.config';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('MS_VALIDATION');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntiFraudModule,
    kafkaConfig,
  );

  await app.listen();
  logger.log(`Server listening kafka service`);
}
bootstrap();
