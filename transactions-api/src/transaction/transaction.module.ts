import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { KafkaModule } from '../shared/kafka/kafka.module';
import { PrismaModule } from '../shared/prisma/prisma.module';

@Module({
  imports: [KafkaModule, PrismaModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
