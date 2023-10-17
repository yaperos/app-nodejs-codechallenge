import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from './transaction.entity';
import { TranferTypeModule} from 'src/tranfer-type/tranfer-type.module';
import { TransactionStatusModule} from 'src/transaction-status/transaction-status.module';
import { ApprovedTransactionConsumer} from './approvedTransaction.consumer'
import { RejectedTransactionConsumer} from './rejectedTransaction.consumer'
import { KafkaModule} from 'src/kafka/kafka.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    TranferTypeModule,
    TransactionStatusModule, 
    KafkaModule],
  providers: [TransactionService, TransactionResolver, RejectedTransactionConsumer, ApprovedTransactionConsumer]
})
export class TransactionModule {}
