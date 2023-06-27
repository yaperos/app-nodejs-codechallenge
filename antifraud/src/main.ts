import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'antifraud-consumer',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'antifraud-consumer',
      },
    },
  });

  app.listen();
}
bootstrap();
