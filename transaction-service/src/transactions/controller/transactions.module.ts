import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from '../service/transactions.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { KafkaProducer } from 'src/kafka/kafka.producer';
import { KafkaConsumer } from 'src/kafka/kafka.consumer';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, KafkaConsumer, KafkaProducer],
})
export class TransactionsModule {}
