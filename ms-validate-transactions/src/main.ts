import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: process.env.KAFKA_CLIENT_ID,
          //clientId: 'transactions',

          brokers: [process.env.KAFKA_BROKERCONNECT],
        },
        consumer: {
          groupId: process.env.KAFKA_CONSUMER_ID,
          //groupId: 'transactions-retrieve-consumer',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
