import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { KAFKA_CONSUMER_GROUP_ID } from './app/kafka';
import { getEnvironmentVars } from './app/Enviroment';

async function bootstrap() {
  const ENVS = getEnvironmentVars();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [`${ENVS.kafka.host}:${ENVS.kafka.port}`],
        },
        consumer: {
          groupId: KAFKA_CONSUMER_GROUP_ID,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
