import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const kafkaMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'transaction-service',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
