import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { TransactionModule } from './transaction.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  await microservice.listen();
  await app.listen(process.env.PORT);
}
bootstrap();
