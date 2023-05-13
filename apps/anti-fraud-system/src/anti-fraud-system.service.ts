import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InputTransactionEvent } from './dto/input-transaction-events-dtos';
import {
  OutputTransactionEventApproved,
  OutputTransactionEventRejected,
} from './dto/output-transaction-events-dtos';

@Injectable()
export class AntiFraudSystemService {
  private readonly logger;

  constructor(@Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka) {
    this.logger = new Logger(AntiFraudSystemService.name);
  }

  validateTransaction(transactionEvent: InputTransactionEvent): any {
    const { data } = transactionEvent;
    const transactionExternalId = data.transactionExternalId;
    const events = {
      APPROVED: 'transaction.rejected',
      REJECTED: 'transaction.approved',
    };

    const validations = [
      {
        name: 'Has a valid origin',
        func: (transactionEvent: InputTransactionEvent) =>
          transactionEvent.meta.origin === 'api-transactions',
      },
      {
        name: 'The origin account has enough money',
        func: (transactionEvent: InputTransactionEvent) => {
          // TODO: add validation logic
          return true;
        },
      },
      {
        name: 'Limit ammount',
        // NOTE: this was a requirement of the challenge
        func: (transactionEvent: InputTransactionEvent) =>
          transactionEvent.data.value <= 1000,
      },
      {
        name: 'The origin account has transactions available in the same day',
        func: (transactionEvent: InputTransactionEvent) => {
          // TODO: add validation logic
          return true;
        },
      },
      //... more logic validation
    ];

    let approved = true;
    let rejectMessage = null;
    const meta = {
      date: new Date(),
      origin: 'anti-fraud-system',
    };

    for (const { name, func: validationFunction } of validations) {
      const passed = validationFunction(transactionEvent);
      if (!passed) {
        approved = false;
        rejectMessage = `NOT PASSED: ${name}`;
        break;
      }
    }

    if (approved) {
      const message: OutputTransactionEventApproved = {
        meta,
        data: {
          transactionExternalId,
        },
      };
      this.logger.log(`${transactionExternalId} APPROVED`);
      this.kafkaClient.emit(events.APPROVED, message);
    } else {
      const message: OutputTransactionEventRejected = {
        meta,
        data: {
          transactionExternalId,
          reason: rejectMessage,
        },
      };
      this.logger.warn(`${transactionExternalId} REJECTED`);
      this.kafkaClient.emit(events.REJECTED, message);
    }
  }
}
