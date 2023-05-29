import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { kafkaConfig } from '../config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: kafkaConfig.brokers,
          clientId: kafkaConfig.clientId,
        },
        consumer: {
          groupId: 'antifraud-group',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
