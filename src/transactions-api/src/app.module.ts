import { Module } from '@nestjs/common';
import { RedisCacheModule } from './modules/redis-cache.module';
import { KafkaModule } from './modules/kafka.module';
import { TransactionsController } from './controllers/transactions.controller';
import { RedisCacheService } from './services/redis-cache.service';
import { KafkaProducerService } from './services/kafka-producer.service';
import { KafkaConsumerService } from './services/kafka-consumer.service';
import { TransactionResolver } from './resolvers/transaction.resolver';

@Module({
  imports: [RedisCacheModule, KafkaModule],
  controllers: [TransactionsController],
  providers: [
    RedisCacheService,
    KafkaProducerService,
    KafkaConsumerService,
    TransactionResolver,
  ],
})
export class AppModule {}
