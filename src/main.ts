import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const BROKER_SERVER = process.env.BROKER_SERVER;
  const BROKER_USERNAME = process.env.BROKER_USERNAME;
  const BROKER_PASSWORD = process.env.BROKER_PASSWORD;
  const BROKER_CONSUMER = process.env.BROKER_CONSUMER;

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [BROKER_SERVER],
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: BROKER_USERNAME,
          password: BROKER_PASSWORD
        }
        
      },
      consumer: {
        groupId: BROKER_CONSUMER,
      },
      subscribe: {
        fromBeginning: true,
      },
    },
  } as MicroserviceOptions);
  
  await app.startAllMicroservices();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true, 
    })
  );

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}

bootstrap();