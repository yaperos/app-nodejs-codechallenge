import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/shared';
import { ValidateTransactionModule } from './validate-transaction/validate-transaction.module';

@Module({
  imports: [LoggerModule, ValidateTransactionModule],
})
export class AntiFraudModule {}
