import { Module } from '@nestjs/common';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './controllers/transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionsResolver } from './resolvers/transactions.resolver';
import { ProducerService } from 'src/kafka/producer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction])
  ],
  providers: [TransactionsService,TransactionsResolver,ProducerService],
  controllers: [TransactionsController],
  exports: [TransactionsService,TypeOrmModule]
})
export class TransactionsModule {}
