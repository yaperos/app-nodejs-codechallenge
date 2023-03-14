import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransactionKafkaConfig } from '@core/config/kafka';
import { loggerConfig } from '@core/config/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, loggerConfig);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      TransactionKafkaConfig(),
    );
  const logger = new Logger(bootstrap.name);

  await microservice.listen();
  logger.log('Microservice YAPE TRANSACTION started');
}
bootstrap();
