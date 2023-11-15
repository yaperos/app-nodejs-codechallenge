import { Module } from '@nestjs/common';
import { TransactionService } from 'src/transactions/transaction.service';
import { AntiFruadService } from './antiFraud.service';
import { TransactionModule } from 'src/transactions/transaction.module';

@Module({
  controllers: [],
  providers: [AntiFruadService],
  imports: [TransactionModule],
  exports: [AntiFruadService],
})
export class AntiFraudModule {}
