import { NestFactory } from '@nestjs/core';
import { AntifraudModule } from './antifraud.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ANTIFRAUD_CONSUMER } from 'default/common/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntifraudModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['kafka:29092'],
        },
        consumer: {
          groupId: ANTIFRAUD_CONSUMER,
        },
      },
    },
  );
  app.listen();
}
bootstrap();
