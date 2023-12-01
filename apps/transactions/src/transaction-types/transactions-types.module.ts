import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '@/config/typeorm.config';
import { KafkaConfig } from '@/config/kafka.config';
import { TransactionTypesService } from './transactions-types.service';
import { TransactionTypesController } from './transactions-types.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(TypeOrmConfig.financialTransactionEntities),
    KafkaConfig.Module,
  ],
  controllers: [TransactionTypesController],
  providers: [TransactionTypesService],
})
export class FinancialTransactionModule {}
