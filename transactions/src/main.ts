import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logEnabled = process.env.LOG_ENABLED === 'true';

  if (logEnabled) {
    app.useLogger(['log', 'error', 'warn']);
  }

  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'transactions',
        brokers: process.env.BROKER_SEED.split(' '),
        connectionTimeout: 30000,
      },
      consumer: {
        groupId: 'transactions-consumer',
      },
      subscribe: {
        fromBeginning: true,
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.PORT);
}
bootstrap();
