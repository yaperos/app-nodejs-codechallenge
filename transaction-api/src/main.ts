import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug'],
    cors: true,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'transaction',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
    },
  });

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('port');

  app.use(compression());
  // app.use(morgan());

  await app.startAllMicroservices();
  await app.listen(port);

  Logger.log(`Server running in http://localhost:${configService.get('port')}`);
}

bootstrap();
