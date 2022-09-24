import { KafkaService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './transaction.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);

  app.useGlobalPipes(new ValidationPipe());

  const kafkaService = app.get<KafkaService>(KafkaService);
  app.connectMicroservice(kafkaService.getOptions('TRANSACTION'));
  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
