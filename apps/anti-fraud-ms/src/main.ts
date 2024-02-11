import { NestFactory } from '@nestjs/core';
import { AntiFraudMsModule } from './anti-fraud-ms.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AntiFraudMsModule, {
    name: 'KAFKA_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'anti-fraud-ms',
        brokers: ['localhost:9092'],
      },
      producer: {
        allowAutoTopicCreation: true,
      },
      consumer: {
        groupId: 'transactions-ms',
      },
    },
  });
  await app.listen();
}
bootstrap();
