import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Main-Transaction-MS');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'transaction-ms',
          brokers: envs.KAFKA_SERVERS,
        },
        consumer: {
          groupId: 'transaction-consumer',
        },
      },
    },
  );

  await app.listen();
  logger.log(`Trnsaction-MS is listening messages of Kafka`);
}
bootstrap();
