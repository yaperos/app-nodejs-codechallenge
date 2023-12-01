import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AppModule } from './api/appModule';
import { config } from './config'

async function bootstrap() {
  console.log(config)
  const { kafka } = config

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: kafka.clientId,
          brokers: [kafka.uri],
        },
        producer: {
          createPartitioner: Partitioners.LegacyPartitioner
        },
        consumer: {
          groupId: kafka.groupId,
        },
      },
    },
  );
  await app.listen();

}
bootstrap();