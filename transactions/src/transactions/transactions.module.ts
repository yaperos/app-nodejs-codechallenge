import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransactionsResolver } from './transactions.resolver';

@Module({
  providers: [TransactionsResolver],
  imports: [PrismaModule],
})
export class TransactionsModule {}
