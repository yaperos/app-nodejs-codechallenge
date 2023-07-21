import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TransfertypesModule } from 'src/transfertypes/transfertypes.module';
import { TransactionstatusModule } from 'src/transactionstatus/transactionstatus.module';

@Module({
  imports: [ KafkaModule ,TypeOrmModule.forFeature([ Transaction ]), TransfertypesModule, TransactionstatusModule],
  providers: [TransactionsService, TransactionsResolver]
})
export class TransactionsModule {}
