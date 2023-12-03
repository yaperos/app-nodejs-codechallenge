import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { TransactionModule } from './transaction/transaction.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'antifraud',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'antifraud-consumer',
      },
      subscribe: {
        fromBeginning: true,
      },
    },
  });

  app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();