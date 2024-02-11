import { Module } from '@nestjs/common';
import { AntiFraudMsController } from './anti-fraud-ms.controller';
import { AntiFraudMsService } from './anti-fraud-ms.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { TRANSACTION_CLIENT } from './constants';
import {
  RETRY,
  SESSION_TIMEOUT,
  TRANSACTION_CONSUMER_CLIENT,
  TRANSACTION_SERVER,
} from 'utils/utils/constants-global';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: TRANSACTION_CLIENT,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: TRANSACTION_SERVER,
              brokers: [configService.get<string>('KAFKA_BROKER_URL')],
            },
            producerOnlyMode: true,
            consumer: {
              groupId: TRANSACTION_CONSUMER_CLIENT,
              sessionTimeout: SESSION_TIMEOUT,
              retry: { retries: RETRY },
              allowAutoTopicCreation: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    HealthModule,
  ],
  controllers: [AntiFraudMsController],
  providers: [AntiFraudMsService],
})
export class AntiFraudMsModule {}
