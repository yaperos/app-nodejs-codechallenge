import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get('KAFKA_BROKER')],
      },
      consumer: {
        groupId: configService.get('KAFKA_CONSUMER_CONSUMER_GROUP_ID'),
      },
    },
  });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
  await app.listen(+configService.get('PORT'));
}
bootstrap();
