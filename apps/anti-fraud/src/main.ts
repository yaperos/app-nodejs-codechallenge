import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Logger } from '@nestjs/common';
import { AntiFraudModule } from "./anti-fraud.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AntiFraudModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'anti-fraud-app',
        brokers: ['localhost:9092'],
        connectionTimeout: 3000
      },
      consumer: {
        groupId: 'anti-fraud-consumer'
      }
    },
  });

  await app.listen();
  Logger.log('Kafka microservice is running');
}
bootstrap();