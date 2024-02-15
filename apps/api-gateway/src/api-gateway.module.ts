import { TRANSACTIONS_SERVICE } from '@app/common/constants/service-names';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionsController } from 'apps/api-gateway/src/transactions/transactions.controller';
import { TransactionService } from 'apps/api-gateway/src/transactions/transactions.service';

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
  providers: [TransactionService],
})
export class ApiGatewayModule {}
