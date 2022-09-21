import { KafkaService } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './transaction.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);
  const kafkaService = app.get<KafkaService>(KafkaService);
  app.connectMicroservice(kafkaService.getOptions('TRANSACTION'));
  await app.startAllMicroservices();
}
bootstrap();
