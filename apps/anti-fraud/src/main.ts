import { NestFactory } from '@nestjs/core';
import { AntiFraudModule } from './anti-fraud.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AntiFraudModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'anti-fraud-consumer',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3003);
}
bootstrap();
