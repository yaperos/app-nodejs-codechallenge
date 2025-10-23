export enum TransactionStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class TransactionStatus {
  constructor(public name: TransactionStatusEnum) {}

  rejectTransaction() {
    this.name = TransactionStatusEnum.REJECTED;
  }
  approveTransaction() {
    this.name = TransactionStatusEnum.APPROVED;
  }
}
