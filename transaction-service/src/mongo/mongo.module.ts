import {Module} from '@nestjs/common';
import {balanceModel, balanceSchema} from '../modules/balances/schema/balance.schema';
import {
  transactionModel,
  transactionSchema,
} from '../modules/transactions/schema/transaction.schema';
import {MongooseModule} from '@nestjs/mongoose';
import {BalanceService} from '../modules/balances/service/balance.service';
import {TransactionService} from '../modules/transactions/service/transaction.service';
import {ClientsModule, Transport} from "@nestjs/microservices";

export const MongoSchemas = [
  {name: balanceModel.name, schema: balanceSchema},
  {name: transactionModel.name, schema: transactionSchema},
];

export const MongoServices = [BalanceService, TransactionService];

@Module({
  imports: [
    MongooseModule.forFeature(MongoSchemas),
    ClientsModule.register([
      {
        name: 'ANTI_FRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-service',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-service-consumer',
          },
        },
      },
    ]),
  ],
  providers: [...MongoServices],
  exports: [...MongoServices],
})
export class MongoModule {
}
