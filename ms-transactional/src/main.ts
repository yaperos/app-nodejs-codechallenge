import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      subscribe: {
        fromBeginning: false,
      },
      consumer: {
        groupId: 'kafka-consumer',
      },
      client: {
        brokers: ['localhost:9092'],
      },
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.startAllMicroservices();
  await app
    .listen(configService.get('APP_PORT') || 3000)
    .then(() =>
      Logger.log(
        `Server running on port ${configService.get('APP_PORT')}`,
        'Bootstrap',
      ),
    );
}
bootstrap();
