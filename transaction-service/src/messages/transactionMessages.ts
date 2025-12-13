// Interfaces de eventos para la mensajería entre microservicios
import { TransactionStatusName } from '../enum/TransactionStatusName';

export interface TransactionCreatedEvent {
  transactionExternalId: string;
  value: number;
}

export interface TransactionStatusEvent {
  transactionExternalId: string;
  status: TransactionStatusName;
}
