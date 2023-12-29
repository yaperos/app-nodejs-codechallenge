import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: process.env.KAFKA_CLIENT_ID
            ? process.env.KAFKA_CLIENT_ID
            : 'antifraud-ms-client',
          brokers: [
            process.env.KAFKA_SERVER
              ? process.env.KAFKA_SERVER
              : 'localhost:9092',
          ],
        },
        consumer: {
          groupId: process.env.KAFKA_GROUP_ID
            ? process.env.KAFKA_GROUP_ID
            : 'yape-kafka-consumers',
        },
      },
    },
  );
  app.listen();
}
bootstrap();
