import { Module } from '@nestjs/common';
import { TransactionResolvers } from './transaction.resolvers';
import { TransactionService } from './transaction.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [TransactionResolvers, TransactionService, PrismaService],
})
export class transactionModule {}