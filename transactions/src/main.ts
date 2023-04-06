import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      subscribe: {
        fromBeginning: true,
      },
      consumer: {
        groupId: 'anti-fraud',
      },
      client: {
        brokers: ['kafka:29092'],
      },
    },
  } as MicroserviceOptions);

  try {
    app.startAllMicroservices();
    await app.listen(4000);
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
