import { NestFactory } from '@nestjs/core';
import { AntiFraudMsModule } from './anti-fraud-ms.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AntiFraudMsModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'anti-fraud-consumer',
      },
    },
    abortOnError: true,
  });
  await app.listen();
}
bootstrap();
