import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'antifraud',
          brokers: [process.env.KAFKA_BROKER],
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
