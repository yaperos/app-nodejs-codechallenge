import { Module } from '@nestjs/common';
import { TransactionStatusService } from './transaction-status.service';
import { TransactionStatusResolver } from './transaction-status.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionStatus} from './entities/transaction-status.entity'

@Module({
  imports: [TypeOrmModule.forFeature([TransactionStatus])],
  providers: [TransactionStatusResolver, TransactionStatusService],  
  exports:[TransactionStatusService]
})
export class TransactionStatusModule {}
