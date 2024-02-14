import { NestFactory } from '@nestjs/core';
import { TransactionsModule } from './transactions.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { TRANSACTIONS_SERVICE } from '@app/common/constants/service-names';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get('APP_BROKER')],
      },
      consumer: {
        groupId: TRANSACTIONS_SERVICE,
      },
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
