import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionService } from './transaction.service';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';

@Module({
  providers: [TransactionResolver, TransactionService, PrismaService, ProducerService, ConsumerService],
})
export class TransactionModule { }
