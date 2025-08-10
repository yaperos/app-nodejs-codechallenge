import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { createValidationPipe } from '@shared/common';

import { AntiFraudModule } from './anti-fraud.module';

const brokers = (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',');
const clientId = process.env.ANTI_FRAUD_CLIENT_ID ?? 'anti-fraud';
const consumerGroupId = process.env.ANTI_FRAUD_GROUP_ID ?? 'anti-fraud-consumer';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AntiFraudModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId,
        brokers,
      },
      consumer: {
        groupId: consumerGroupId,
      },
      run: { autoCommit: false },
    },
  });

  app.useGlobalPipes(createValidationPipe());

  await app.listen();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
