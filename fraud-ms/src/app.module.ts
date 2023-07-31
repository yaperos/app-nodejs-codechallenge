import { Module } from '@nestjs/common';
import { KafkaModule } from './shared/kafka/kafka.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [KafkaModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
