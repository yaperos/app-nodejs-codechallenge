import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const antiFraudMicroserviceConfig: MicroserviceOptions = {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configService.get<string>('ANTI_FRAUD_CLIENT_ID'),
        brokers: [configService.get<string>('KAFKA_BROKER')],
      },
      producer: {
        allowAutoTopicCreation: true,
        createPartitioner: Partitioners.DefaultPartitioner,
      },
      consumer: {
        allowAutoTopicCreation: true,
        groupId: configService.get<string>('ANTI_FRAUD_GROUP_ID'),
      },
    },
  };

  app.connectMicroservice<MicroserviceOptions>(antiFraudMicroserviceConfig);

  await app.startAllMicroservices();
}

bootstrap();
