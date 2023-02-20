import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { envConstants } from './core/domain/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microserviceKafka = app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: envConstants.KAFKA_CLIENT_ID,
        brokers: [envConstants.KAFKA_BROKER],
      },
      consumer: {
        groupId: envConstants.KAFKA_CONSUMER_GROUP_ID,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
