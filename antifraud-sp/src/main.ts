import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './antifraud/antifraud.module';
import { config } from 'dotenv';

async function bootstrap() {
  config();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:29092'],
        },
        consumer: {
          groupId: 'antifraud-consumer-02',
          heartbeatInterval: 15000,
        },
        run: {
          autoCommit: false,
        },
      },
    },
  );
  app.listen();
}
bootstrap();
