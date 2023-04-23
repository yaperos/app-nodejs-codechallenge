import { NestFactory } from '@nestjs/core';
import { AntiFraudModule } from './anti-fraud.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AntiFraudModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: process.env.KAFKA_BROKERS.split(','),
      },
      consumer: {
        groupId: 'anti-fraud-consumer',
      }
    }
  });
  
  app.listen();
}
bootstrap();
