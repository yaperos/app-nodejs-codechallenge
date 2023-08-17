import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as process from 'process';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );
  const kafkaServer = app.get(ConfigService).get('KAFKA_SERVER');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [String(kafkaServer)],
        clientId: 'transaction-client',
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
      run: {
        autoCommit: false,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
