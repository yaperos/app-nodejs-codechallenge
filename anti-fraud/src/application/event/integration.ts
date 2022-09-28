import { TransactionEssentialProperties } from '../../domain/transaction';

export class IntegrationEvent {
  readonly subject: string;
  readonly data: TransactionEssentialProperties;
}

export interface IntegrationEventPublisher {
  publish: (event: IntegrationEvent) => Promise<void>;
}

export enum IntegrationEventSubject {
  OPENED = 'transaction-validate.opened',
}
