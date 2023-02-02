import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { MicroserviceOptions } from '@nestjs/microservices/interfaces';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get<string>('APP_PORT')).then(() => {
    Logger.log(
      `Service is listening on port ${configService.get<string>('APP_PORT')}`,
    );
  });

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'transaction',
          brokers: [configService.get<string>('KAFKA_BROKER')],
        },
        consumer: {
          groupId: 'transaction-consumer',
        },
      },
    });

  await microservice.listen().then(() => {
    Logger.log(`Microservice is listening...`);
  });
}
bootstrap();
