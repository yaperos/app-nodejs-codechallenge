import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config/envs';
import { ResponseFormatInterceptor } from './interceptors/response-format.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'ms-transaction-cm-prod',
          brokers: [envs.KAFKA_BROKER],
        },
        consumer: {
          groupId: 'transaction-group-cm', // grupo único por microservicio si quieres que cada uno consuma todo
        },
      },
    },
  );

  app.useGlobalInterceptors(new ResponseFormatInterceptor());

  const port = envs.PORT || 3002;

  await app.listen();

  console.log(`Microservice is listening on port ${port}`);
}
bootstrap();
