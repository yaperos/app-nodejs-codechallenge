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
          clientId: 'yape',
          brokers: [
            `${process.env.KAFKA_HOST || 'localhost'}:${
              process.env.KAFKA_PORT || '9092'
            }`,
          ],
        },
        consumer: {
          groupId: 'yape-consumer',
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
