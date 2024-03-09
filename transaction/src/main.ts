import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `transaction-consumer`,
          brokers: ['kafka:29092'],
        },
        consumer: {
          groupId: 'consumer-update',
        },
      },
    },
  );
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
