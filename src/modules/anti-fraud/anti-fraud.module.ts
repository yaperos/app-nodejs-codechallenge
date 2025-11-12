import { Module } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { KafkaModule } from '../../kafka/kafka.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [KafkaModule, TransactionModule],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
