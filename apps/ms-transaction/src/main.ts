import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MsTransactionModule } from './ms-transaction.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsTransactionModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_URL],
        },
        consumer: {
          groupId: 'transactions-consumer',
        },
      },
    },
  );
  await app.listen();
}

bootstrap();
