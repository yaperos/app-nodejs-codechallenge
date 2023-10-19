import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ReadTransactionModule } from './read-transaction.module';

async function bootstrap() {
  const app = await NestFactory.create(ReadTransactionModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.CLIENT_ID,
        brokers: [process.env.BROKER],
      },
      consumer: {
        groupId: process.env.GROUP_READ_TRANSACTION
      }
    }
  } as MicroserviceOptions);

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.READ_PORT || 3001;
  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`🚀 App Read-Transaction is running on: http://localhost:${port}/graphql`);
}
bootstrap();
