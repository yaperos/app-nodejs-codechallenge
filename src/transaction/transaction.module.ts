import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from '../common/prisma.service';
import { KafkaService } from '../common/kafka/kafka.service';
import { KafkaProducerService } from '../common/kafka/kafka.producer';
import { KafkaConsumerService } from '../common/kafka/kafka.consumer';

@Module({
  controllers: [TransactionController],
  providers: [
    TransactionService,
    PrismaService,
    KafkaService,
    KafkaProducerService,
    KafkaConsumerService,
  ],
})
export class TransactionModule {}
