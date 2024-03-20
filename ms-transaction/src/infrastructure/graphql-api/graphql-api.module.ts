import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { TransactionResolver } from './resolver/transaction.resolver';
import { ProducerModule } from '../messaging/producer/producer.module';

@Module({
  imports: [PrismaModule, ProducerModule],
  providers: [TransactionResolver],
  exports: [],
})
export class GraphqlApiModule {}
