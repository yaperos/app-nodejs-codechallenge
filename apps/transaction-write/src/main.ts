import { NestFactory } from '@nestjs/core';
import { TransactionWriteModule } from './transaction-write.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(TransactionWriteModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);

  const appKafka = await NestFactory.createMicroservice<MicroserviceOptions>(
    TransactionWriteModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:29092'],
        },
        consumer: {
          groupId: 'transactionwrite-consumer',
        },
      },
    },
  );
  await appKafka.listen();
}
bootstrap();
