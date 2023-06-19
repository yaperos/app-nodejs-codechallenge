
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  })

  const configService = app.get<ConfigService>(ConfigService)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: configService.get<Array<string>>('application.kafka.bootstrap-servers'),
      },
      consumer: {
        groupId: configService.get('application.kafka.groupId'),
      },
    },
  });

  app.startAllMicroservices();
}

bootstrap();
