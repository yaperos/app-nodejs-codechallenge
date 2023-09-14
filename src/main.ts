import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { MainModule } from './modules/main/main.module';
import { ServerConfigType } from './modules/config/types/server.type';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      subscribe: {
        fromBeginning: true,
      },
      consumer: {
        groupId: 'kafka-consumer',
      },
      client: {
        brokers: ['localhost:9092'],
      },
    },
  } as MicroserviceOptions);

  const configService: ConfigService = app.get(ConfigService);
  const { port, applicationName } =
    configService.get<ServerConfigType>('server');

  app.enableCors();
  app.startAllMicroservices();
  await app.listen(port, () => {
    Logger.log(`HTTP server listening on port ${port}`, `${applicationName}`);
  });
}
bootstrap();
