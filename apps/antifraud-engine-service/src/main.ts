import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger, } from '@nestjs/common';
import { AntifraudEngineServiceModule } from './antifraud-engine-service.module';

const logger = new Logger('antifraud-engine-service');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AntifraudEngineServiceModule, {
    logger: ['error', 'warn', 'log'],
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9091'],
      },
      consumer: {
        groupId: 'antifraud-engine-consumer' 
      },
    }
  });
  await app.listen();
  logger.log('Antifraud Engine Microservice is running');
}
bootstrap();
