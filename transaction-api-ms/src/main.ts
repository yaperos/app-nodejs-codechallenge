import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservice = app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'transaction',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'transaction-consumer'
      }
    }
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
