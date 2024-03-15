import { Module } from '@nestjs/common';
import { ITransactionService } from './application/services/ITransactionService';
import { TransactionService } from './application/services/impl/TransactionService';
import { KafkaProducerClientFactory } from './infrastructure/stream/producer/KafkaProducerFactory';
import { IKafkaProducer } from './domain/stream/producer/IKafkaProducer';
import { KafkaProducer } from './infrastructure/stream/producer/KafkaProducer';
import { IKafkaConsumer } from './domain/stream/consumer/IKafkaConsumer';
import { KafkaConsumer } from './infrastructure/stream/consumer/KafkaConsumer';
import { KafkaConsumerClientFactory } from './infrastructure/stream/consumer/KafkaConsumerFactory';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [
    KafkaProducerClientFactory,
    KafkaConsumerClientFactory,
    {
      provide: ITransactionService,
      useClass: TransactionService,
    },
    {
      provide: IKafkaProducer,
      useClass: KafkaProducer,
    },
    {
      provide: IKafkaConsumer,
      useClass: KafkaConsumer,
    },
  ],
})
export class AppModule {}
