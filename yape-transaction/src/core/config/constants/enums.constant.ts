export enum TransactionStatusEnum {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum TransactionTypeEnum {
  TYPE_1 = 'CREDIT',
  TYPE_2 = 'DEBIT',
  TYPE_3 = 'OTHER',
}

export const TransactionStatusId = {
  [TransactionStatusEnum.PENDING]: 1,
  [TransactionStatusEnum.APPROVED]: 2,
  [TransactionStatusEnum.REJECTED]: 3,
};

export enum AntifraudPattern {
  VALIDATE_ANTIFRAUD = 'VALIDATE_ANTIFRAUD',
}
