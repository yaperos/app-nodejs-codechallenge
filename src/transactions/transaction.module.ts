import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { ThirdPartiesModule } from '@/third-parties/third-parties.module';
import { TransactionConsumerService } from './transaction-consumer.service';

@Module({
  imports: [ThirdPartiesModule],
  providers: [
    TransactionResolver,
    TransactionService,
    TransactionConsumerService,
  ],
})
export class TransactionModule {}
