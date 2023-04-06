import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ANTI_FRAUD_CONSUMER, ANTI_FRAUD_SERVICE_NAME, MAIN_CONSUMER_GROUP } from './app.constants';

async function bootstrap() {
  const configService = new ConfigService();
  const brokers = [`${configService.get('KAFKA_BROKER')}`];

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: ANTI_FRAUD_SERVICE_NAME,
          brokers
        },
        consumer: {
          groupId: ANTI_FRAUD_CONSUMER,
        }
      }
    }
  );

  await app.listen();
}
bootstrap();