import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: { brokers: ['localhost:9092'] },
        consumer: {
          groupId: 'antifraud-consumer',
        },
      },
    },
  );
  app.listen();
}

bootstrap();
