import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AntiFraudModule } from './anti-fraud.module';
import { AppService } from './app.service';

async function bootstrap() {
  const config = AppService.KafkaConfig();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AntiFraudModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: config.brokers,
      },
      consumer: {
        groupId: config.groupId,
      },
    },
  });
  app.listen();
}
bootstrap();
