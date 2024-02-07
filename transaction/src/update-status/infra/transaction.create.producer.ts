import { Injectable } from '@nestjs/common';
import { BrokerEventsName } from 'src/shared/infrastructure/broker/broker.enum';
import { KafkaProducerService } from 'src/shared/infrastructure/broker/kafka/producer.service';
import {
  TransactionCreateEvent,
  TransactionCreateEventInput,
} from '../domain/transaction.create.event';

@Injectable()
export class TransactionCreateProducerKafka implements TransactionCreateEvent {
  constructor(private readonly producer: KafkaProducerService) {}

  handle(input: TransactionCreateEventInput): Promise<boolean> {
    return this.producer.emit(BrokerEventsName.TRANSACTION_NEW, input);
  }
}
