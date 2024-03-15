import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { IKafkaConsumer } from './domain/stream/consumer/IKafkaConsumer';

async function bootstrap(): Promise<any> {
  const app = await NestFactory.createApplicationContext(AppModule);
  const consumer = app.get(IKafkaConsumer);
  await consumer.startConsumer();
}

bootstrap()
  .then((next) => {
    return next;
  })
  .catch((err) => {
    Logger.error(err.message);
  });
