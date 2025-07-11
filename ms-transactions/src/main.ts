import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3001);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configService.get<string>(
          'app.kafka.clientId',
          'ms-transactions',
        ),
        brokers: configService.get<string[]>('app.kafka.brokers', [
          'localhost:9092',
        ]),
      },
      consumer: {
        groupId: configService.get<string>(
          'app.kafka.groupId',
          'ms-transactions-group',
        ),
      },
      run: {
        autoCommit: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
}
void bootstrap();
