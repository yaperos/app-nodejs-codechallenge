import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { Transaction } from './entities/transaction.entity';
import { AntiFraudModule } from '../anti-fraud/anti-fraud.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    AntiFraudModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}