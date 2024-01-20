import { NestFactory } from '@nestjs/core';
import { TransactionsModule } from './transactions.module';
import { ValidationPipe } from '@nestjs/common';
import { TRANSACTIONS_CONSUMER } from 'default/common/constants';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: TRANSACTIONS_CONSUMER,
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
