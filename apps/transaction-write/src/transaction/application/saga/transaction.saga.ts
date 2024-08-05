// transaction.saga.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Saga } from '@nestjs/cqrs';
import { Observable, from } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { TransactionCreatedSagaEvent } from './transaction-created-saga.event';
import {
  REPLICATE_TRANSACTION_CREATED_TOPIC,
  REPLICATE_TRANSACTION_UPDATED_TOPIC,
  TRANSACTION_VALIDATED_TOPIC,
} from '@app/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionStatusUpdatedSagaEvent } from './transaction-updated-saga.event';

@Injectable()
export class TransactionSaga {
  private readonly logger = new Logger(TransactionSaga.name);
  constructor(
    @Inject('TRANSACTION_KAFKA_CLIENT')
    private readonly clientKafka: ClientKafka,
  ) {}

  @Saga()
  transactionFlow = (events$: Observable<any>): Observable<any> => {
    return events$.pipe(
      mergeMap((event) => {
        if (event instanceof TransactionCreatedSagaEvent) {
          this.logger.log(
            `Event General 1: Handling event of type ${event.constructor.name} with data: ${JSON.stringify(event)}`,
          );

          this.clientKafka.emit(
            REPLICATE_TRANSACTION_CREATED_TOPIC,
            JSON.stringify(event.data),
          );

          this.clientKafka.emit(
            TRANSACTION_VALIDATED_TOPIC,
            JSON.stringify({
              id: event.data.transactionInternalId,
              value: event.data.value,
            }),
          );

          return [event];
        } else if (event instanceof TransactionStatusUpdatedSagaEvent) {
          this.logger.log(
            `Event General 3: Handling event of type ${event.constructor.name} with data: ${JSON.stringify(event)}`,
          );

          this.clientKafka.emit(
            REPLICATE_TRANSACTION_UPDATED_TOPIC,
            JSON.stringify(event.data),
          );

          return [event];
        }
        return [];
      }),
      catchError((error) => {
        this.logger.error(`Error handling event: ${error.message}`);
        return from(Promise.reject(error));
      }),
    );
  };
}
