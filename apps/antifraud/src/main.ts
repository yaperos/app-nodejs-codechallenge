import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { KafkaConfig } from '@transactions/config/kafka.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(AppModule);
  const configService = context.get(ConfigService);
  const kafkaOptions = KafkaConfig.getOptions(configService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    kafkaOptions,
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
