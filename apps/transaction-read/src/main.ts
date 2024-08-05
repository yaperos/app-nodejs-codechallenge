import { NestFactory } from '@nestjs/core';
import { TransactionReadModule } from './transaction-read.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(TransactionReadModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);

  const appKafka = await NestFactory.createMicroservice<MicroserviceOptions>(
    TransactionReadModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:29092'],
        },
        consumer: {
          groupId: 'transactionread-consumer',
        },
      },
    },
  );
  await appKafka.listen();
}
bootstrap();
