import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { createValidationPipe } from '@shared/common';

import { AppModule } from './app.module';

const brokers = (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',');
const clientId = process.env.TX_API_CLIENT_ID ?? 'transactions-api';
const consumerGroupId = process.env.TX_API_GROUP_ID ?? 'transactions-api-consumer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(createValidationPipe());

  const ms = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId,
        brokers,
      },
      consumer: { groupId: consumerGroupId },
      run: { autoCommit: false },
    },
  });
  
  ms.useGlobalPipes(createValidationPipe());

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
