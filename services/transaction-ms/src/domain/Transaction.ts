export enum TransactionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum TransactionTransferType {
  BankTransfer = 1,
  WalletTransfer = 2,
  InternalTransfer = 3,
}

export class Transaction {
  transactionExternalId: string;

  accountExternalIdDebit: string;

  accountExternalIdCredit: string;

  transferTypeId: TransactionTransferType;

  value: number;

  status: TransactionStatus;

  createdAt: number;

  updatedAt: number;

  constructor(data?: Partial<Transaction>) {
    Object.assign(this, data);
  }

  getNameByTransferTypeId(): string {
    switch (this.transferTypeId) {
      case TransactionTransferType.BankTransfer:
        return "Bank Transfer";
      case TransactionTransferType.WalletTransfer:
        return "Wallet Transfer";
      case TransactionTransferType.InternalTransfer:
        return "Internal Transfer";
      default:
        return "Unknown";
    }
  }

  getApiData() {
    return {
      transactionExternalId: this.transactionExternalId,
      transactionType: {
        name: this.getNameByTransferTypeId(),
      },
      transactionStatus: {
        name: this.status,
      },
      value: this.value,
      createdAt: new Date(this.createdAt).toISOString(),
    };
  }

  getEventData() {
    return {
      transactionExternalId: this.transactionExternalId,
      status: this.status,
    };
  }
}
