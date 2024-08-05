import { NestFactory } from '@nestjs/core';
import { AntifraudMsModule } from './antifraud-ms.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntifraudMsModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:29092'],
        },
        consumer: {
          groupId: 'antifraud-consumer',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
