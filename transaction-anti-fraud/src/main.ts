import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
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
        clientId: 'transactions-validate',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'transactions-validate-consumer-validate',
      },
    },
  });

  app.startAllMicroservices();

  await app.listen(4000);
}

bootstrap();
