import { Module } from '@nestjs/common';
import { TransactionsService } from './services/transactions.service';
import { TransactionsResolver } from './resolvers/transactions.resolver';
import { CommonModule } from 'src/common/common.module';
import { TasksModule } from '../tasks/tasks.module';
import { TransactionsController } from './controllers/transactions.controller';

@Module({
  controllers: [TransactionsController],
  imports: [CommonModule, TasksModule],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}
