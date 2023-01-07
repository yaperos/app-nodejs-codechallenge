import { NestFactory } from '@nestjs/core';
import {MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport:Transport.KAFKA,
    options:{
      consumer:{
        groupId:'challenger-consumer'
      },
      client:{
        brokers:['localhost:9092'],

      }
    }
  }as MicroserviceOptions);

  app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
