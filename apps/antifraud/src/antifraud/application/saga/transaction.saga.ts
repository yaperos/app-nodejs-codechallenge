import { Inject, Injectable, Logger } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TransactionStatusUpdatedSagaEvent } from './transaction-status-updated-saga.event';
import { TRANSACTION_STATUS_UPDATED_TOPIC } from '@app/common';
import { ClientKafka } from '@nestjs/microservices';

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
      ofType(TransactionStatusUpdatedSagaEvent),
      map((event) => {
        this.logger.log(
          `Event General 2: Handling event of type ${event.constructor.name} with data: ${JSON.stringify(event)}`,
        );

        this.clientKafka.emit(
          TRANSACTION_STATUS_UPDATED_TOPIC,
          JSON.stringify(event.data),
        );

        return event;
      }),
      catchError((error) => {
        this.logger.error(`Error handling event: ${error.message}`);
        return from(Promise.reject(error));
      }),
    );
  };
}
