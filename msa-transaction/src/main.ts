import 'dotenv/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './middleware/all-exceptions.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const logger = new Logger(`Service Transaction`);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      subcribe: {
        formBeginning: true,
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
      client: {
        brokers: [process.env.KAFKA_URL],
      },
    },
  } as MicroserviceOptions);
  app.startAllMicroservices();
  app.init();
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ? +process.env.PORT : 3000);
  logger.log(`Microservice is listening on: ${await app.getUrl()}`);
}
bootstrap();
