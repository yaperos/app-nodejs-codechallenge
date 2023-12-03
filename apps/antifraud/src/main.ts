import { NestFactory } from '@nestjs/core';
import { AntifraudModule } from './antifraud.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntifraudModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'antifraud',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'antifraud-consumer',
        },
        subscribe: {
          fromBeginning: true,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
