import { Module } from '@nestjs/common';
import { TransactionValidationService } from './transaction-validation.service';
import { TransactionValidationController } from './transaction-validation.controller';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionStatusModule } from 'src/transaction-status/transaction-status.module';

@Module({
  imports: [TransactionModule, TransactionStatusModule],
  controllers: [TransactionValidationController],
  providers: [TransactionValidationService],
})
export class TransactionValidationModule {}
