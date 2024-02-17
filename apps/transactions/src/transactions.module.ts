import { Module } from '@nestjs/common';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { DatabaseModule, CacheManagerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ANTI_FRAUD_SERVICE } from '@app/common/constants/service-names';
import { TransactionsRepository } from 'apps/transactions/src/repositories/transactions.repository';

@Module({
  imports: [
    DatabaseModule,
    CacheManagerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: ANTI_FRAUD_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: ANTI_FRAUD_SERVICE,
                brokers: [configService.get('APP_BROKER')],
              },
              consumer: {
                groupId: ANTI_FRAUD_SERVICE,
              },
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
