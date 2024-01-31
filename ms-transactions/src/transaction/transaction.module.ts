import { Module, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { KafkaProducerService } from 'src/kafka/producer.service';
import { KafkaConsumerService } from 'src/kafka/consumer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionResolver, TransactionService, KafkaProducerService , KafkaConsumerService]
})
export class TransactionModule {}
