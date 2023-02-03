import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // await app.listen(3000).then(() => {
  //   console.log('App is listening');
  // });
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
