import { FinancialTransaction } from '@/transactions/entities/financial-transaction.entity';

export class KafkaTopics {
  static FinancialTransactionCreated = 'transaction.created';
  static FinancialTransactionStatusUpdated = 'transaction.status.updated';
}

export type FinancialTransactionCreatedPayload = FinancialTransaction;
export type FinancialTransactionStatusUpdatedPayload = FinancialTransaction;
