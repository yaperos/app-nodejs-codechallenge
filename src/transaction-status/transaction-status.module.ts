import { Module } from '@nestjs/common';
import { TransactionStatusService } from './transaction-status.service';
import { TransactionStatusResolver } from './transaction-status.resolver';
import { TransactionStatus } from './transaction-status.entity';
import { TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionStatus])],
  providers: [TransactionStatusService, TransactionStatusResolver ],
  exports: [TransactionStatusService]  
})
export class TransactionStatusModule {} 
 
