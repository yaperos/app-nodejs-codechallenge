import { NestFactory } from '@nestjs/core';
import { AntifraudMsModule } from './antifraud-ms.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as kafkaConfig from '../config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntifraudMsModule,
    {
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
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen();
}
bootstrap();
