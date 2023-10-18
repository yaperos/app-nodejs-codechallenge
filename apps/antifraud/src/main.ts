import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AntifraudModule } from './antifraud.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AntifraudModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.CLIENT_ID,
        brokers: [process.env.BROKER],
      },
      consumer: {
        groupId: process.env.GROUP_ANTIFRAUD,
      }
    }
  });
  await app.listen();
  Logger.log(`🚀 Application only lives in Kafka`);
}
bootstrap();
