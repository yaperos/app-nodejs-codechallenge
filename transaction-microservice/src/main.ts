import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    fromBeginning: true,
    options: {
      client: {
        clientId: 'transactions-kafka',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'kafka-transactions-16',
      },
    },
  } as MicroserviceOptions);

  app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
