export enum TransactionStatusEnum {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum TransactionTypeEnum {
  TYPE_1 = 'type 1',
  TYPE_2 = 'type 2',
  TYPE_3 = 'type 3',
}

export const TransactionStatusId = {
  [TransactionStatusEnum.PENDING]: 1,
  [TransactionStatusEnum.APPROVED]: 2,
  [TransactionStatusEnum.REJECTED]: 3,
};
