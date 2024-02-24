import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_SERVER],
      },
      consumer: {
        groupId: 'bcp-antifraud-group',
        sessionTimeout: 10000,
        retry: { retries: 20 }
      },
    },
  });

  await microservice.listen();

}
bootstrap();
