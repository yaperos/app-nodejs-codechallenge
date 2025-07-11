import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3002);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configService.get<string>(
          'app.kafka.clientId',
          'fraud-detection',
        ),
        brokers: configService.get<string[]>('app.kafka.brokers', [
          'localhost:9092',
        ]),
      },
      consumer: {
        groupId: configService.get<string>(
          'app.kafka.groupId',
          'fraud-detection-group',
        ),
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
}

void bootstrap();
