import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`${process.env.KAFKA_HOST}:9092`],
      },
      consumer: {
        groupId: 'antifraud-consumer',
      },
    },
  } as MicroserviceOptions);

  await app.startAllMicroservices();
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
