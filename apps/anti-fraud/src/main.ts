import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AntiFraudModule } from './anti-fraud.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntiFraudModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
        },
        consumer: {
          groupId: 'anti-fraud-consumer',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
