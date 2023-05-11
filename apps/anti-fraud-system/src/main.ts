import { NestFactory } from '@nestjs/core';
import { AntiFraudSystemModule } from './anti-fraud-system.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntiFraudSystemModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'group-1',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
