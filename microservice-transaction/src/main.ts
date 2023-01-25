import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { MicroserviceOptions } from '@nestjs/microservices/interfaces';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'transaction',
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
    }
  })

  app.startAllMicroservices();
  await app.listen(process.env.PORT);
  Logger.log(`Microservice Transaction is running on port ${process.env.PORT}`);
}
bootstrap();
