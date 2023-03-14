import { NestFactory } from '@nestjs/core';
import { AntifraudModule } from './antifraud.module';
import { ValidationPipe } from '@nestjs/common';
import { KafkaConfigService } from './config/kafka-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AntifraudModule);
  KafkaConfigService.connectKafka(app);
  app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
