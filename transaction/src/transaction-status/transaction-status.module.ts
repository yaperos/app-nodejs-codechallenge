import { Module, forwardRef } from '@nestjs/common';
import { TransactionStatusService } from './transaction-status.service';
import { TransactionStatusResolver } from './transaction-status.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionStatus } from './entities/transaction-status.entity';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionStatus]),
    forwardRef(() => TransactionModule),
  ],
  providers: [TransactionStatusResolver, TransactionStatusService],
  exports: [TransactionStatusService],
})
export class TransactionStatusModule {}
