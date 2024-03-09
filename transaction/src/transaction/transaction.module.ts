import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { transactionProviders } from './transaction.providers';
import { DatabaseModule } from 'src/database/database.module';
import { TransactionStatusModule } from 'src/transaction-status/transaction-status.module';
import { TransactionTypeModule } from 'src/transaction-type/transaction-type/transaction-type.module';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction_service',
            brokers: ['kafka:29092'],
          },
        },
      },
    ]),
    TransactionStatusModule,
    TransactionTypeModule
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    ...transactionProviders,
  ],
})
export class TransactionModule {}
