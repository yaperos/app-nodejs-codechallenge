import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClientOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { AppConfiguration } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const kafkaClientOptions: ClientOptions = {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'api-ms-transaction-client',
        brokers: [AppConfiguration().kafka_broker],
      },
      consumer: {
        groupId: 'api-ms-transaction-consumer',
      },
    },
  };
  const grpcClientOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      url: AppConfiguration().kafka_broker,
      package: 'transaction',
      protoPath: 'src/transaction/transaction.proto',
    },
  };
  app.connectMicroservice(grpcClientOptions);
  app.connectMicroservice(kafkaClientOptions);
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
