/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { v4 as uuidv4 } from 'uuid';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configApp = await NestFactory.create(AppModule);

  const configService = configApp.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `consumer-${uuidv4()}`,
          brokers: [configService.get<string>('KAFKA_BROKER')],
        },
        consumer: {
          groupId: configService.get<string>('KAFKA_GROUP_ID'),
        },
      },
    }
  );
  app.listen();
}
bootstrap();
