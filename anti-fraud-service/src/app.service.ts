import { Inject, Injectable } from '@nestjs/common';
import {
  TransactionCreatedEvent,
  TransactionValidatedEvent,
} from './transactions.event';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionStatus } from './common/commonTypes';
import { ProducerService } from './kafka/producer.service';

@Injectable()
export class AppService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionClient: ClientKafka,
    private readonly producerService: ProducerService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  handlerTransactionCreated(transactionCreatedEvent: TransactionCreatedEvent) {
    console.log('Resiving event', transactionCreatedEvent);
    let transactionStatus = TransactionStatus.APPROVED;
    // Math.random() > 0.5 ? 'APPROVED' : 'REJECTED';
    if (transactionCreatedEvent.amount > 1000) {
      transactionStatus = TransactionStatus.REJECTED;
      console.log('Error transacción mayor a 1000');
    }
    this.producerService.produce({
      topic: 'update-transaction',
      messages: [
        {
          value: JSON.stringify(
            new TransactionValidatedEvent(
              transactionCreatedEvent.id,
              transactionStatus,
            ),
          ),
        },
      ],
    });
  }
}
