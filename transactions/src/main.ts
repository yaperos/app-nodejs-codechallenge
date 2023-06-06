import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { config } from 'dotenv';

async function bootstrap() {
  config({ path: './../.env' });

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:29092'],
      },
      consumer: {
        groupId: 'antifraud-consumer-01',
        heartbeatInterval: 15000,
      },
      run: {
        autoCommit: false,
      },
    },
  });

  app.startAllMicroservices();
  app.listen(3000);
}
bootstrap();
