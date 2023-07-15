import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import env from './confi/env';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'antifraud',
          brokers: [env.KAFKA_BROKER],
        },
        consumer: {
          groupId: 'antifraud-consumer',
        },
      },
    },
  );
  app.listen();
}
bootstrap();
