import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TransactionModule } from './transaction.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('TRANSACTION_PORT');

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        // brokers: [configService.get<string>('KAFKA_BROKER_URL')],
        brokers: ['localhost:9092'],
        // clientId: 'transaction-service',
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  await microservice.listen();
  await app.listen(port);

  Logger.log(`Transaction service is running on: http://localhost:${port}`);
}
bootstrap();
