import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      subscribe: { fromBeginning: true },
      options: {
        client: {
          clientId: 'antifraud',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'anti-fraud-consumer',
        },
      },
    },
  } as MicroserviceOptions);

  app.startAllMicroservices();

  await app.listen(4000);
}
bootstrap();
