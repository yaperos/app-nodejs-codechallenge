import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { loggerConfig } from '@core/config/logger';
import { AntifraudKafkaConfig } from '@core/config/kafka';

async function bootstrap() {
  await NestFactory.create(AppModule, loggerConfig);
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      AntifraudKafkaConfig(),
    );
  const logger = new Logger(bootstrap.name);

  await microservice.listen();
  logger.log('Microservice YAPE ANTI FRAUD started');
}
bootstrap();
