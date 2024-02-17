import { Module } from '@nestjs/common';
import { AntiFraudController } from './controllers/anti-fraud.controller';
import { AntiFraudService } from './services/anti-fraud.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  TRANSACTIONS_SERVICE,
  TRANSACTION_BY_ANTI_FRAUD,
} from '@app/common/constants/service-names';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: TRANSACTION_BY_ANTI_FRAUD,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: [configService.get('APP_BROKER')],
              },
              consumer: {
                groupId: TRANSACTIONS_SERVICE,
              },
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
