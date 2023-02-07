import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionController } from '../../controllers/transaction/transaction.controller';
import { TransactionService } from '../../services/transaction/transaction.service';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [TransactionService, ConfigService],
})
export class TransactionModule {}
