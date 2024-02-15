import { NestFactory } from '@nestjs/core';
import { AntiFraudModule } from './anti-fraud.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ANTI_FRAUD_SERVICE } from '@app/common/constants/service-names';

async function bootstrap() {
  const app = await NestFactory.create(AntiFraudModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get('APP_BROKER')],
      },
      consumer: {
        groupId: ANTI_FRAUD_SERVICE,
      },
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
