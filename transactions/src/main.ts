import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: process.env.KAFKA_CLIENT_ID,
          brokers: [process.env.KAFKA_BROKER],
        },
        consumer: {
          groupId: process.env.KAFKA_GROUP_ID,
        },
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen();
}
bootstrap();
