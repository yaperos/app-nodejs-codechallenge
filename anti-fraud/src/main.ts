import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

import { AntiFraudModule } from './anti-fraud.module';

async function bootstrap() {
  const app = await NestFactory.create(AntiFraudModule);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        // brokers: ['localhost:9092'],
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'antifraud-consumer',
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  await microservice.listen();
  await app.listen(process.env.PORT);
}
bootstrap();
