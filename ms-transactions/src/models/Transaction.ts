import { CreateTransactionRequest } from '../requests/CreateTransactionRequest';
import { TransactionEntity } from '../database/entities/TransactionEntity';

export class Transaction {
  transactionExternalId: string | undefined;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionType: number;
  transactionStatus: number;
  value: number;
  createdAt: Date | undefined;

  constructor(
    transactionExternalId: string | undefined,
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    transactionType: number,
    transactionStatus: number,
    value: number,
    createdAt: Date | undefined
  ) {
    this.transactionExternalId = transactionExternalId;
    this.accountExternalIdDebit = accountExternalIdDebit;
    this.accountExternalIdCredit = accountExternalIdCredit;
    this.transactionType = transactionType;
    this.transactionStatus = transactionStatus;
    this.value = value;
    this.createdAt = createdAt;
  }

  static fromRequest(request: CreateTransactionRequest) {
    return new Transaction(
      undefined,
      request.accountExternalIdDebit,
      request.accountExternalIdCredit,
      request.tranferTypeId,
      1,
      request.value,
      undefined
    );
  }

  toEntity() {
    return TransactionEntity.build({
      transactionExternalId: this.transactionExternalId,
      accountExternalIdCredit: this.accountExternalIdCredit,
      accountExternalIdDebit: this.accountExternalIdDebit,
      transactionType: this.transactionType,
      transactionStatus: this.transactionStatus,
      value: this.value
    });
  }
}
