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
          clientId: `${configService.get<string>('app.kafka.clientId')}-consumer`,
        },
        run: {
          autoCommit: false,
        },
        consumer: {
          groupId: consumerGroupId,
        },
      },
    },
    { inheritAppConfig: true }
  );

  await app.startAllMicroservices();
  logger.log(`Kafka consumer microservice started. Group ID: ${consumerGroupId}`);


  await app.listen(appPort);
  logger.log(`Antifraud service is running on port ${appPort}`);
}
bootstrap();
