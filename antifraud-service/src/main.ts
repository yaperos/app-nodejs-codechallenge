import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      consumer: {
        groupId: 'antifraud-consumer',
      },
      client: {
        clientId: 'antifraud',
        brokers: [
          configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
        ],
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: configService.get<string>('KAFKA_USERNAME') || '',
          password: configService.get<string>('KAFKA_PASSWORD') || '',
        },
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
