interface TransferType {
  id: number;
  name: string;
}

interface TransactionStatus {
  name: string;
}

export interface TransactionUpdatedDto {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionExternalId: string;
  value: number;
  transferType: TransferType;
  transactionStatus: TransactionStatus;
  createdAt: Date;
}
