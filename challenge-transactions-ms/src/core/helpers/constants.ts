export const ClientModuleRegister = 'KAFKA_TRANSACTION_EMITTER_MS';

export enum TransactionTypes {
  deposit = 1,
  transfer = 2,
}

export enum TransactionStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}
