import { KafkaService } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { AntiFraudModule } from './anti-fraud.module';

async function bootstrap() {
  const app = await NestFactory.create(AntiFraudModule);
  const kafkaService = app.get<KafkaService>(KafkaService);
  app.connectMicroservice(kafkaService.getOptions('ANTI_FRAUD'));
  await app.startAllMicroservices();
}
bootstrap();
