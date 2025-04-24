import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('AntifraudServiceBootstrap');
  logger.log('Starting antifraud service...');

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService)!;
  const appPort = configService.get<number>('app.port')!;
  const kafkaBroker = configService.get<string>('app.kafka.broker')!;
  const consumerGroupId = configService.get<string>('app.kafka.consumerGroupId')!;

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [kafkaBroker],
          // Add clientId specific to the consumer instance if desired
          clientId: `${configService.get<string>('app.kafka.clientId')}-consumer`,
        },
        run: {
          autoCommit: false,
        },
        consumer: {
          groupId: consumerGroupId, // Critical for consumer group behavior
          // Optional: configure session timeout, heartbeat interval, etc.
          // sessionTimeout: 30000,
          // heartbeatInterval: 3000,
          // allowAutoTopicCreation: false, // Recommended for production
        },
        // subscribe: {
        // Optional: Explicitly define topics here if not using @MessagePattern discovery
        // topics: [KAFKA_TOPIC_TRANSACTION_CREATED],
        // fromBeginning: false, // Start consuming from the latest offset
        // }
      },
    },
    { inheritAppConfig: true } // Inherit logging, etc. from the main app
  );

  await app.startAllMicroservices();
  logger.log(`Kafka consumer microservice started. Group ID: ${consumerGroupId}`);


  await app.listen(appPort);
  logger.log(`Antifraud service is running on port ${appPort}`);
}
bootstrap();
