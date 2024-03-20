import { NestFactory } from '@nestjs/core';
import { TransactionsModule } from './transactions.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'transactions-consumer',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
