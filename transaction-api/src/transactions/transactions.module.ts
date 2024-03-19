import { Module } from '@nestjs/common';
import { TransactionsResolver } from './transactions.resolver';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [TypeOrmModule.forFeature([
    Transaction
  ]),
  ClientsModule.register([
    {
      name: 'KAFKA',
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092']
        }
      }
    }
  ])
  ],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule { }
