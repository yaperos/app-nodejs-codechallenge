import { Module } from '@nestjs/common';
import { TransactionStatus } from './entities/transaction-status.entity';
import { TransactionType } from './entities/transaction-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionsResolver } from './transaction.resolver';
import { TransactionsService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
// import { LoggerModule } from '@app/shared';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionStatus, Transaction, TransactionType]),
    ClientsModule.register([
      {
        transport: Transport.KAFKA,
        name: 'ANTI_FRAUD_SERVICE',
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'anti-fraud',
          },
        },
      },
    ]),
  ],
  providers: [TransactionsResolver, TransactionsService],
  controllers: [TransactionController],
})
export class TransactionModule {}
