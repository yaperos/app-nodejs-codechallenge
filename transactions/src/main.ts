import { NestFactory } from '@nestjs/core';
import { AppModule } from './retrieve-transaction/retrieve.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      subscribe: {
        fromBeginning: true,
      },
      client: {
        clientId: 'transactions-api',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'transactions-validate-consumer',
      },
    },
  });

  app.startAllMicroservices();
  await app.listen(3003);
}

bootstrap();
