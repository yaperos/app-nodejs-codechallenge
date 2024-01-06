import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT_TRANSACTION');

  Logger.debug(port, 'Port');

  const kafkaHost = configService.get<string>('KAFKA_HOST');
  const kafkaPort = configService.get<number>('KAFKA_PORT');

  const dbHost = configService.get<number>('DB_HOST');
  const dbPort = configService.get<number>('DB_PORT');

  Logger.debug(`${dbHost}:${dbPort}`, 'DataBase');

  Logger.debug(`${kafkaHost}:${kafkaPort}`, 'KafkaConsumer');

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      subscribe: { fromBeginning: true },
      options: {
        client: {
          brokers: [`${kafkaHost}:${kafkaPort}`],
        },
        consumer: {
          groupId: 'transaction-group',
        },
        run: {
          autoCommit: false,
        },
      },
    },
  } as MicroserviceOptions);

  app.startAllMicroservices();

  await app.listen(port);
}
bootstrap();
