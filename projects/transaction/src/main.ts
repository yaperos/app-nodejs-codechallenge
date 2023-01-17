import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`${process.env.KAFKA_HOST}:9092`],
      },
      consumer: {
        groupId: 'anti-fraud-consumer',
      },
    },
  } as MicroserviceOptions);
  await app.startAllMicroservices();
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
