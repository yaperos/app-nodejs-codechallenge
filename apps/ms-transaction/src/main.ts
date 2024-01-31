import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      consumer: {
        groupId: 'ms-transaction-consumer',
      },
      client: {
        brokers: ['localhost:9092'],
      },
    },
  } as MicroserviceOptions);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => new BadRequestException(errors),
  }));

  await app.startAllMicroservices();
  await app.listen(4100);
}
bootstrap();
