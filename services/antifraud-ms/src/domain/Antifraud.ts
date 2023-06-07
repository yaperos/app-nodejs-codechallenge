export enum TransactionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export class Antifraud {
  transaction: {
    transactionExternalId: string;
    value: number;
    status: string;
  };

  constructor(data?: Partial<Antifraud>) {
    Object.assign(this, data);
  }

  getEventData() {
    return {
      transaction: {
        transactionExternalId: this.transaction.transactionExternalId,
        status: this.transaction.status,
      },
    };
  }

  getApiData() {
    return {
      transaction: {
        transactionExternalId: this.transaction.transactionExternalId,
        value: this.transaction.value,
        status: this.transaction.status,
      },
    };
  }
}
