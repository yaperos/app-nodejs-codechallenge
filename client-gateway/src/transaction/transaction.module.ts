import { Module } from '@nestjs/common';
import { ExternalTransactionResolver } from './transaction.resolver';
import { KafkaModule } from 'src/transports/kafka.module';

@Module({
  providers: [ExternalTransactionResolver],
  imports: [KafkaModule],
})
export class TransactionModule {}
