import { NestFactory } from '@nestjs/core';
import { MsModule } from './ms.module';
import { KafkaService } from '@app/common';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(MsModule);

  const kafkaService = app.get<KafkaService>(KafkaService);
  app.connectMicroservice<MicroserviceOptions>(kafkaService.getOptions());

  await app.startAllMicroservices();
  await app.init();
}
bootstrap();
