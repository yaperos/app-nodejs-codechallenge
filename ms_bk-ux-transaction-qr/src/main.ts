import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ResponseFormatInterceptor } from './interceptors/response-format.interceptor';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'ms-transaction-qr',
          brokers: [envs.KAFKA_BROKER],
        },
        consumer: {
          groupId: 'transaction-group-qr',
        },
      },
    },
  );

  app.useGlobalInterceptors(new ResponseFormatInterceptor());

  const port = envs.PORT ?? 3000;
  await app.listen();

  console.log(`Microservice is listening on ${port}`);
}
bootstrap();
