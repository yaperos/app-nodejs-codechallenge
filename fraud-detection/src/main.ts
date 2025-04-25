import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClientsModule,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'fraud-detection',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'fraud-consumer',
        },
      },
    },
  );
  app.listen();
}
bootstrap();
