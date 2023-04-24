import { Module } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { AntifraudController } from './antifraud.controller';
import { TransactionRepository } from '@/contexts/transaction/transaction.repository';

@Module({
  imports: [],
  controllers: [AntifraudController],
  providers: [AntifraudService, TransactionRepository],
  exports: [AntifraudService, TransactionRepository],
})
export class AntifraudModule {}
