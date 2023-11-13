import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { CLIENT_KAFKA, GROUP_KAFKA } from './app.constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: CLIENT_KAFKA.ID,
          brokers: [process.env.KAFKA_URL],
        },
        consumer: {
          groupId: GROUP_KAFKA.ID,
        },
        subscribe: {
          fromBeginning: true,
        },
      },
    },
  );
  app.listen();
}
bootstrap();
