import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        retry: {
          retries: 2,
        },
        clientId: 'anti-fraud',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'anti-fraud-consumer',
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
