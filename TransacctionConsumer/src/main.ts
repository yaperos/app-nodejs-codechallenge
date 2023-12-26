import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.kafkaServer ? process.env.kafkaServer :  'localhost:9092'],
      },
      consumer: {
        groupId: process.env.groupId ? process.env.groupId :  'yape-kafka',
      }
    }
  });

  app.listen().then(r=> console.log('Kafka consumer service is listening!'))
}
bootstrap();
