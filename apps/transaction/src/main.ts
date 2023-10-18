import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TransactionModule } from './transaction.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.CLIENT_ID,
        brokers: [process.env.BROKER],
      },
      consumer: {
        groupId: process.env.GROUP_TRANSACTION
      }
    }
  } as MicroserviceOptions);

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3000;
  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/graphql`);
}
bootstrap();
