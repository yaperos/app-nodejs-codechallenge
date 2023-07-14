import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as kafkaConfig from '../config/kafka.config';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: kafkaConfig.KAFKA_SERVER_CLIENT_ID,
        brokers: [kafkaConfig.KAFKA_BROKER],
      },
      consumer: {
        groupId: kafkaConfig.KAFKA_SERVER_GROUP_ID,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
