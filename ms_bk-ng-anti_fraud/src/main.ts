import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'ms-anti-fraud',
          brokers: [envs.KAFKA_BROKER],
        },
        consumer: {
          groupId: 'transaction-group-anti-fraud',
        },
      },
    },
  );

  const port = envs.PORT ?? 3000;
  await app.listen();

  console.log(`Microservice is listening on ${port}`);
}
bootstrap();
