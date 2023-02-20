import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microserviceKafka = app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'TRANSACTION',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'anti-fraud-consumer',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
