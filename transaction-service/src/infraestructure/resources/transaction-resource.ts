import { Transaction } from "../../domain/entities/transaction";

export class TransactionResource {
  constructor(private transaction: Transaction) {}

  public toJson(): object {
    return {
      transactionExternalId: this.transaction.id.value,
      transactionType: {
        name: this.transaction.tranferTypeId.name,
      },
      transactionStatus: {
        name: this.transaction.status,
      },
      value: this.transaction.value,
      createdAt: this.transaction.createdAt,
    };
  }
}
