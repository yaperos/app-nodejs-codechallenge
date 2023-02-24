export type ValidateTransactionDto = {
  id: number;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  amount: number;
};

export enum AntifraudPattern {
  VALIDATE_ANTIFRAUD = 'VALIDATE_ANTIFRAUD',
}
export enum TransactionPattern {
  VALIDATE_TRANSACTION = 'VALIDATE_TRANSACTION',
}
