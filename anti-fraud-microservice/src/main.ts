import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: env.KAFKA_CLIENT_ID,
          brokers: [env.KAFKA_BROKER],
        },
        consumer: {
          groupId: env.KAFKA_CONSUMER_GROUP_ID,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
