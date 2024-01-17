import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { KafkaOptions, Transport } from '@nestjs/microservices';

const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'my-consumer-' + Math.random(),
    },
  },
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(kafkaConfig);
  await app.startAllMicroservices();
  await app.listen(3005);
}
bootstrap();