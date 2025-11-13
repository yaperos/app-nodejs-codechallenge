export type TransactionStatus = 'pending' | 'approved' | 'rejected';

export interface TransactionProps {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
  status: TransactionStatus;
  createdAt: Date;
}

export interface Transaction extends TransactionProps {}

export interface TransactionCreatedEvent {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
  createdAt: Date;
}

export interface TransactionStatusChangedEvent {
  transactionExternalId: string;
  status: TransactionStatus;
  reason?: string | null;
  evaluatedAt: Date;
}

export interface TransactionView {
  transactionExternalId: string;
  transactionType: { name: string };
  transactionStatus: { name: TransactionStatus };
  value: number;
  createdAt: Date;
}

export interface CreateTransactionParams {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
  createdAt: Date;
}

export const TransactionStatusName: Record<TransactionStatus, TransactionStatus> = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
};

export const buildTransactionTypeName = (transferTypeId: number): string =>
  `transferTypeId:${transferTypeId}`;

export const createPendingTransaction = (
  params: CreateTransactionParams,
): Transaction => ({
  ...params,
  status: 'pending',
});

export const toTransactionView = (transaction: Transaction): TransactionView => ({
  transactionExternalId: transaction.transactionExternalId,
  transactionType: { name: buildTransactionTypeName(transaction.transferTypeId) },
  transactionStatus: { name: transaction.status },
  value: transaction.value,
  createdAt: transaction.createdAt,
});

export const toTransactionCreatedEvent = (
  transaction: Transaction,
): TransactionCreatedEvent => ({
  transactionExternalId: transaction.transactionExternalId,
  accountExternalIdDebit: transaction.accountExternalIdDebit,
  accountExternalIdCredit: transaction.accountExternalIdCredit,
  transferTypeId: transaction.transferTypeId,
  value: transaction.value,
  createdAt: transaction.createdAt,
});
