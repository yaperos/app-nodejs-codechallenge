import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { EnvConfig } from './config/env.config';
import { TransactionKafkaConfig } from './config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    TransactionKafkaConfig(),
  );
  await app.listen();

  Logger.log(
    `App is running in ${EnvConfig.environment()} mode. Press CTRL-C to stop.`,
  );
}
bootstrap();
