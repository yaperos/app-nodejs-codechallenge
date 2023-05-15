import { NestFactory } from '@nestjs/core';
import { AntiFraudSystemModule } from './anti-fraud-system.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntiFraudSystemModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER],
        },
        consumer: {
          groupId: 'group-consummer-2',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
