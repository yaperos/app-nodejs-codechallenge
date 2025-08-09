import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

const brokers = (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',');
const clientId = process.env.TX_API_CLIENT_ID ?? 'transactions-api';
const consumerGroupId = process.env.TX_API_GROUP_ID ?? 'transactions-api-consumer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
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

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
