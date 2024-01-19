import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { KafkaModule } from './kafka/kafka.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TransactionsModule, KafkaModule, PrismaModule, TasksModule],
})
export class AppModule {}
