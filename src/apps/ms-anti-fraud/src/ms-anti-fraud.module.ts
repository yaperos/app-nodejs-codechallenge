import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from "@nestjs/microservices"
import { AntiFraudController } from './ms-anti-fraud.controller'
import { AntiFraudService } from './ms-anti-fraud.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'transaction-service',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get('KAFKA_TRANSACTION_CLIENT_ID'),
              brokers: [configService.get('KAFKA_BROKER_URL')],
            },
            consumer: {
              groupId: configService.get('KAFKA_TRANSACTION_CONSUMER_ID'),
            },
          },
        }),
        inject: [ConfigService],
      }
    ]),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
