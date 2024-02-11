import { NestFactory } from '@nestjs/core';
import { AntiFraudMsModule } from './anti-fraud-ms.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import {
  ANTI_FRAUD_CONSUMER_SERVER,
  ANTI_FRAUD_SERVER,
  RETRY,
  SESSION_TIMEOUT,
} from 'utils/utils/constants-global';

async function bootstrap() {
  const app = await NestFactory.create(AntiFraudMsModule);
  const configService = app.get(ConfigService);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get<string>('KAFKA_BROKER_URL')],
        clientId: ANTI_FRAUD_SERVER,
      },
      consumer: {
        groupId: ANTI_FRAUD_CONSUMER_SERVER,
        sessionTimeout: SESSION_TIMEOUT,
        retry: { retries: RETRY },
        allowAutoTopicCreation: true,
      },
    },
  });

  await microservice.listen();
}

bootstrap();
