import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`${process.env.KAFKA_HOST}:9092`],
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
    },
  } as MicroserviceOptions);
  await app.listen();
}
bootstrap();
