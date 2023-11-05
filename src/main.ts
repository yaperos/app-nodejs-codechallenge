import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { MainModule } from './modules/main/main.module';
import { ServerConfigType } from './modules/config/types/server.type';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const configService: ConfigService = app.get(ConfigService);
  const {
    port,
    applicationName,
    kafka: { groupId, broker },
  } = configService.get<ServerConfigType>('server');
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      subscribe: {
        fromBeginning: true,
      },
      consumer: {
        groupId,
      },
      client: {
        brokers: [`${broker}`],
      },
    },
  } as MicroserviceOptions);
  app.enableCors();
  app.startAllMicroservices();
  await app.listen(port, () => {
    Logger.log(`HTTP server listening on port ${port}`, `${applicationName}`);
  });
}
bootstrap();
