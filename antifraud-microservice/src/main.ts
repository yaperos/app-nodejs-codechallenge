import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { EnvConfig } from './config/env.config';
import { AntifraudKafkaConfig } from './config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    AntifraudKafkaConfig(),
  );
  await app.listen();

  Logger.log(
    `App is running in ${EnvConfig.environment()} mode. Press CTRL-C to stop.`,
  );
}
bootstrap();
