import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'antifraud-consumer'
        },
        producer: {
          createPartitioner: Partitioners.LegacyPartitioner
        }
      }
    }
  )
  await app.listen();
  Logger.log(`🚀 Antifraud microservice is running!`)
}
bootstrap();
