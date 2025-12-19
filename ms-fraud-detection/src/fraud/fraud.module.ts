import { Module } from '@nestjs/common';
import { EvaluateFraudService } from './service/evaluate-fraud.service';
import { TransactionUpdateKafkaProducer } from './adapter/out/messaging/kafka/transaction-update-kafka.producer';
import { TransactionCreatedKafkaConsumer } from './adapter/in/messaging/kafka/transaction-created-kafka.consumer';

@Module({
  providers: [
    EvaluateFraudService,
    TransactionUpdateKafkaProducer,
    TransactionCreatedKafkaConsumer,
  ],
})
export class FraudModule {}
