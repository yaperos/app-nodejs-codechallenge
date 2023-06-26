import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka.module';
import { ConfigModule } from '@nestjs/config';
import { ValidateTransactionsConsumer } from 'src/consumers/transactions.consumer';
import { ValidateTransactionService } from 'src/services/validate-transaction.service';

@Module({
  imports: [    
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule,
  ],
  providers: [ValidateTransactionsConsumer, ValidateTransactionService],
})
export class TransactionsModule {}
