import { NestFactory } from '@nestjs/core';
import { TransactionsModule } from './transactions.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: process.env.KAFKA_TRANSACTIONS_CONSUMER_GROUP_ID,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.TRANSACTIONS_API_PORT);
}
bootstrap();
