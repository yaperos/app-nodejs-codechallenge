import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { KAFKA_CONSUMER_GROUP_ID } from './app/kafka';

async function bootstrap() {
  const broker = `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [broker],
        },
        consumer: {
          groupId: KAFKA_CONSUMER_GROUP_ID,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
