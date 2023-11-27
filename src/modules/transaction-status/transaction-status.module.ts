import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionStatus } from 'src/domain/entities/transaction-status.entity';
import { TransactionStatusService } from './services/transaction-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionStatus])],
  providers: [TransactionStatusService],
  exports: [TransactionStatusService],
})
export class TransactionStatusModule {}
