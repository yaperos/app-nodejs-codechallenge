import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppConfiguration } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [AppConfiguration().kafka_broker],
        },
        consumer: {
          groupId: 'api-ms-anti-fraud-consumer',
        },
      },
    },
  );
  app.listen();
}
bootstrap();
