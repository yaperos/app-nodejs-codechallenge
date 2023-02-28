import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

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
    },
  });

  await app.startAllMicroservices();
  await app.listen(3006);
}
bootstrap();
