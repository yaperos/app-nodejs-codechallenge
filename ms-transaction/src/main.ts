import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  // Crear el microservicio HTTP
  const httpApp = await NestFactory.create(AppModule);
  await httpApp.listen(3005); // Puedes cambiar el puerto según tus necesidades

  // Crear el microservicio Kafka
  const kafkaApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
      },
    },
  );
  kafkaApp.listen();
}

bootstrap();
