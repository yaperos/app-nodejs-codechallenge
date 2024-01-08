import { Module } from '@nestjs/common';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './controllers/transactions.controller';
import { CommonModule } from '../../common/common.module';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [CommonModule],
})
export class TransactionsModule {}
