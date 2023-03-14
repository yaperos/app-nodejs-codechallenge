import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const logger = new Logger();
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 8080,
      },
    },
  );

  await app
    .listen()
    .then(() => logger.log('Microservice Transaction-Query is listening'))
    .catch(() => logger.log('Microservice Transaction-Query Error'));
}
bootstrap();
