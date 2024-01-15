import { NestFactory } from '@nestjs/core';
import { AntifraudServiceModule } from './antifraud-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntifraudServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:29092'],
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
