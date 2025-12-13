import { TransactionStatusName } from '../enum/TransactionStatusName';

// Representa el evento de creación de una transacción
export interface TransactionCreatedEvent {
  transactionExternalId: string;
  value: number;
}

// Representa el evento de cambio de estado de una transacción
export interface TransactionStatusEvent {
  transactionExternalId: string;
  status: TransactionStatusName.Approved | TransactionStatusName.Rejected;
}
