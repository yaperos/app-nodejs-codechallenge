import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AntiFraudModule } from './ms-anti-fraud.module'
import {MicroserviceOptions, Transport} from "@nestjs/microservices"

async function bootstrap() {
  const app = await NestFactory.create(AntiFraudModule)
  const configService: ConfigService = app.get(ConfigService)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get('KAFKA_BROKER_URL')],
      },
      consumer: {
        groupId: configService.get('KAFKA_ANTI_FRAUD_CONSUMER_ID'),
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(configService.get<number>('ANTI_FRAUD__APP_PORT'))
}
bootstrap()
