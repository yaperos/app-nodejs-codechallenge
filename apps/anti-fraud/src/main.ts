import { NestFactory } from '@nestjs/core';
import { AntiFraudModule } from './anti-fraud.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AntiFraudModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
