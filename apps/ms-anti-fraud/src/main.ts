import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MsAntiFraudModule } from './ms-anti-fraud.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsAntiFraudModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_URL],
        },
        consumer: {
          groupId: 'anti-fraud-validated',
        },
      },
    },
  );
  await app.listen();
}

bootstrap();
