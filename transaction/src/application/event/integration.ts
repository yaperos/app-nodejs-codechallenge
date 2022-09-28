import { TransactionProperties } from '../../domain/transaction';

export class IntegrationEvent {
  readonly subject: string;
  readonly data: TransactionProperties;
}

export interface IntegrationEventPublisher {
  publish: (event: IntegrationEvent) => Promise<void>;
}

export enum IntegrationEventSubject {
  OPENED = 'transaction.opened',
}
