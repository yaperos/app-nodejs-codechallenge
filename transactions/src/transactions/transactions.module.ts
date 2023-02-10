import { Module } from '@nestjs/common';
import { KafkaModule } from 'src/kafka/kafka.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransactionConsumer } from './transactions.consumer';
import { TransactionsResolver } from './transactions.resolver';

@Module({
  providers: [TransactionsResolver, TransactionConsumer],
  imports: [PrismaModule, KafkaModule],
})
export class TransactionsModule {}
