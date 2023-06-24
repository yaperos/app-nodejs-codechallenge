import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.PORT);
}
bootstrap();
