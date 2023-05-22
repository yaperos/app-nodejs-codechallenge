/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-shadow
enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

interface ITransactionType {
  /** Transaction type id */
  id: number;
  /** Transaction type name */
  name: string;
}

interface ITransaction {
  /** Transaction's external id credit */
  accountExternalIdCredit: string;
  /** Transaction's external id debit */
  accountExternalIdDebit: string;
  /** Transaction's createdAt timestamp */
  createdAt: Date;
  /** Transaction unique id */
  transactionExternalId: string;
  /** Transaction's current status */
  transactionStatus: string;
  /** Transaction's type data */
  transactionType?: ITransactionType;
  /** Transaction's type id */
  transactionTypeId: number;
  /** Transaction amount */
  value: number;
}

export { ITransaction, ITransactionType, TransactionStatus };
