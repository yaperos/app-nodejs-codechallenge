import { Module } from '@nestjs/common';
import { TransactionsController } from 'apps/api-gateway/src/transactions/controllers/transactions.controller';
import { TransactionsService } from 'apps/api-gateway/src/transactions/services/transactions.service';
import { TransactionsResolver } from 'apps/api-gateway/src/transactions/resolvers/transactions.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TRANSACTIONS_SERVICE } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: TRANSACTIONS_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: TRANSACTIONS_SERVICE,
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
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsResolver],
})
export class TransactionsModule {}
