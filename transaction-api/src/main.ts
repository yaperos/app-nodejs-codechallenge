import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'transaction',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
