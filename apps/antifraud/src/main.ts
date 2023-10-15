import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AntifraudModule } from './antifraud.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntifraudModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER],
        },
        consumer: {
          groupId: process.env.KAFKA_ANTIFRAUD_CONSUMER_GROUP_ID,
        },
      },
    },
  );
  app.listen();
}
bootstrap();
