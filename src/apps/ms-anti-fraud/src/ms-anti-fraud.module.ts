import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AntiFraudController } from './ms-anti-fraud.controller'
import { AntiFraudService } from './ms-anti-fraud.service'
import { AntiFraudClient } from './ms-anti-fraud.client'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_ANTI_FRAUD_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get('KAFKA_CLIENT_ID'),
              brokers: [configService.get('KAFKA_BROKER_URL')],
            },
            consumer: {
              groupId: configService.get('KAFKA_ANTI_FRAUD_CONSUMER_ID'),
            },
          },
        }),
        inject: [ConfigService],
      }
    ]),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService, AntiFraudClient],
})
export class AntiFraudModule {}
