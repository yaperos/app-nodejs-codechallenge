import { Injectable } from '@nestjs/common';
import { BrokerEventsName } from 'src/shared/infrastructure/broker/broker.enum';
import {
  TransactionValidateEvent,
  TransactionValidateEventProducer,
} from '../domain/transaction-validate.event';
import { KafkaProducerService } from 'src/shared/infrastructure/broker/kafka/producer.service';

@Injectable()
export class TransactionStatusProducerKafka
  implements TransactionValidateEventProducer
{
  constructor(private readonly producer: KafkaProducerService) {}

  handle(input: TransactionValidateEvent): Promise<boolean> {
    return this.producer.emit(
      BrokerEventsName.ANTI_FRAUD_TRANSACTION_STATUS,
      input,
    );
  }
}
