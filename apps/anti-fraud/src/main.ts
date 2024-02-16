import { NestFactory } from '@nestjs/core';
import { AntiFraudModule } from './anti-fraud.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { KafkaService } from '@app/kafka';

async function bootstrap() {
  const app = await NestFactory.create(AntiFraudModule);
  const kafkaService = app.get(KafkaService);

  app.connectMicroservice<MicroserviceOptions>(
    kafkaService.getOptions('ANTI_FRAUD_SERVICE'),
  );

  await app.startAllMicroservices();
}
bootstrap();
