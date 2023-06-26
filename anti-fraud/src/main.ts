import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'anti-fraud',
          brokers: process.env.BROKER_SEED.split(' '),
          connectionTimeout: 30000,
        },
        consumer: {
          groupId: 'anti-fraud-consumer',
        },
        subscribe: {
          fromBeginning: true,
        },
      },
    },
  );

  const logEnabled = process.env.LOG_ENABLED === 'true';

  if (logEnabled) {
    app.useLogger(['log', 'error', 'warn']);
  }

  await app.listen();
}
bootstrap();
