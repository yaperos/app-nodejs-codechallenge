import { Transaction } from '../entities/transaction.entity';

export class TransactionCreatedEvent {
  constructor(private transactionRepo: Transaction) {}

  toString() {
    return JSON.stringify({
      transactionId: this.transactionRepo.transactionId,
      accountExternalIdDebit: this.transactionRepo.accountExternalIdDebit,
      accountExternalIdCredit: this.transactionRepo.accountExternalIdCredit,
      tranferTypeId: this.transactionRepo.tranferTypeId,
      value: this.transactionRepo.value,
      transactionStatus: this.transactionRepo.transactionStatus,
      createdAt: this.transactionRepo.createdAt,
    });
  }
}
