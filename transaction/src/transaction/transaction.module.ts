import { Module, forwardRef } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionStatusModule } from 'src/transaction-status/transaction-status.module';
import { TransactionTypeModule } from 'src/transaction-type/transaction-type.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => TransactionTypeModule),
    forwardRef(() => TransactionStatusModule),
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  providers: [TransactionResolver, TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
