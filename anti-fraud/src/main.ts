import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { KafkaOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SERVER_PORT } from 'config/constants';

const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'yape-consumer',
    },
  },
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(kafkaConfig);
  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  const port = +configService.get<number>(SERVER_PORT)! || 3001;
  await app.listen(port)
}
bootstrap();