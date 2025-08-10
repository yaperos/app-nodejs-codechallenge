import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { createValidationPipe } from '@shared/common';
import { envConfig } from 'libs/config/env.config';

import { AntiFraudModule } from './anti-fraud.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AntiFraudModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: envConfig.kafka.antiFraudClientId,
        brokers: envConfig.kafka.brokers,
      },
      consumer: {
        groupId: envConfig.kafka.antiFraudConsumerGroupId,
      },
      run: { autoCommit: false },
    },
  });

  app.useGlobalPipes(createValidationPipe());

  await app.listen();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
