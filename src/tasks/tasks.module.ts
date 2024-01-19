import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionsModule } from '../transactions/transactions.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TransactionsModule,
  ],
  providers: [TasksService],
})
export class TasksModule {}
