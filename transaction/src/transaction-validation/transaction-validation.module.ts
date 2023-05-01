import { Module } from '@nestjs/common';
import { TransactionValidationService } from './transaction-validation.service';
import { TransactionValidationController } from './transaction-validation.controller';

@Module({
  controllers: [TransactionValidationController],
  providers: [TransactionValidationService]
})
export class TransactionValidationModule {}
