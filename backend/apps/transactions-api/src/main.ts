import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { createValidationPipe } from '@shared/common';
import { envConfig } from 'libs/config/env.config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(createValidationPipe());

  const ms = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: envConfig.kafka.txClientId,
        brokers: envConfig.kafka.brokers,
      },
      consumer: { groupId: envConfig.kafka.txConsumerGroupId },
      run: { autoCommit: false },
    },
  });
  
  ms.useGlobalPipes(createValidationPipe());

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
