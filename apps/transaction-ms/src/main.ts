import { NestFactory } from '@nestjs/core';
import { MsModule } from './ms.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { KafkaService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(MsModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const kafkaService = app.get<KafkaService>(KafkaService);
  app.connectMicroservice<MicroserviceOptions>(kafkaService.getOptions());

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
