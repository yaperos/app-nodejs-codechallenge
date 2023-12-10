import { NestFactory } from '@nestjs/core';
import { TransactionsModule } from './transactions.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'transaction-app',
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
