import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    name: 'HERO_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        // clientId: 'hero',
        brokers: [process.env.KAFKA_URL],
      },
      consumer: {
        groupId: 'antifraud-consumer',
      },
    },
  });

  await app.listen();
}
bootstrap();
