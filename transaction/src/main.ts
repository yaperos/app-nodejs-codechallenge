import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        consumer: {
          groupId: 'transaction-consumer',
        },
        client: {
          brokers: ['localhost:9092'],
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
