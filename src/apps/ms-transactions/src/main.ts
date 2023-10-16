import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { TransactionModule } from './ms-transactions.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule)
  const configService: ConfigService = app.get(ConfigService)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get('KAFKA_BROKER_URL')],
      },
      consumer: {
        groupId: configService.get('KAFKA_TRANSACTION_CONSUMER_ID'),
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(configService.get<number>('TRANSACTION_APP_PORT'))
}
bootstrap()
