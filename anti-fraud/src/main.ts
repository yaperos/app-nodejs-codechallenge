import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        subscribe: {
          fromBeginning: true,
        },
        consumer: {
          groupId: 'transactions',
        },
        client: {
          brokers: ['kafka:29092'],
        },
      },
    },
  );

  app.listen();
}
bootstrap();
