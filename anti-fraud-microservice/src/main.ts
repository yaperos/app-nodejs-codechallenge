import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'ANTI-FRAUD',
          brokers: ['kafka:29092'],
        },
        consumer: {
          groupId: 'transaction-consumer',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
