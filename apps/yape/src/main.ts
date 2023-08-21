import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn']
  });
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'yape-app',
        brokers: ['localhost:9092'],
        connectionTimeout: 3000
      },
      consumer: {
        groupId: 'yape-consumer',
      }
    }
  });
  await app.startAllMicroservices();

  const PORT = +process.env.PORT || 8050;

  await app.listen(PORT);
  Logger.log(`Server is running on http://localhost:${PORT}`);
}
bootstrap();
