import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [CoreModule, TransactionModule],
})
export class MainModule {}
