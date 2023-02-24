export type CreateTransactionDto = {
  id?: number;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  amount: number;
};

export type ValidateTransactionDto = {
  id: number;
  isValidAmount: boolean;
};

export enum AntifraudPattern {
  VALIDATE_ANTIFRAUD = 'VALIDATE_ANTIFRAUD',
}

export enum TransactionPattern {
  CREATE_TRANSACTION = 'CREATE_TRANSACTION',
  VALIDATE_TRANSACTION = 'VALIDATE_TRANSACTION',
}
