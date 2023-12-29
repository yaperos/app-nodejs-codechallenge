import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: process.env.KAFKA_CLIENT_ID
            ? process.env.KAFKA_CLIENT_ID
            : 'transaction-ms-client',
          brokers: [
            process.env.KAFKA_SERVER
              ? process.env.KAFKA_SERVER
              : 'localhost:9092',
          ],
        },
        consumer: {
          groupId: process.env.KAFKA_GROUP_VALIDATIONS_ID
            ? process.env.KAFKA_GROUP_VALIDATIONS_ID
            : 'yape-kafka-validations-consumers',
        },
        subscribe: {
          fromBeginning: true,
        },
      },
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
