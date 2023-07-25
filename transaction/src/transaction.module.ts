import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [TransactionController],
    providers: [TransactionService, PrismaService],
})
export class TransactionModule { }
