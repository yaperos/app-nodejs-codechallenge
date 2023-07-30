import { NestFactory } from '@nestjs/core';
import { TransactionsModule } from './transactions.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(TransactionsModule);
  await app.enableShutdownHooks();
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'antifraud-consumer',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3003);
}
bootstrap();
