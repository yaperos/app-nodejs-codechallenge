import { FinalTransactionStatus } from './transaction-status';

// La key de Kafka de ambos eventos es transactionExternalId: todos los eventos
// de una transacción caen en la misma partición y conservan su orden.

export interface TransactionCreatedEvent {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  // Mismo typo que el contrato del API del README, a propósito.
  tranferTypeId: number;
  // Decimal como string: el monto nunca pasa por un float de JS.
  value: string;
  createdAt: string;
}

export interface TransactionStatusUpdatedEvent {
  transactionExternalId: string;
  status: FinalTransactionStatus;
}
