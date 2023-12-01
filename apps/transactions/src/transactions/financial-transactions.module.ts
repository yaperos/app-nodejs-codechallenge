import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '@/config/typeorm.config';
import { FinancialTransactionsController } from '@/transactions/financial-transactions.controller';
import { FinancialTransactionsService } from '@/transactions/financial-transactions.service';
import { KafkaConfig } from '@/config/kafka.config';

@Module({
  imports: [
    TypeOrmModule.forFeature(TypeOrmConfig.financialTransactionEntities),
    KafkaConfig.Module,
  ],
  controllers: [FinancialTransactionsController],
  providers: [FinancialTransactionsService],
})
export class FinancialTransactionModule {}
