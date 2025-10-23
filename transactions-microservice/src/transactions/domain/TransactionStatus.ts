export enum TransactionStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class TransactionStatus {
  constructor(public name?: TransactionStatusEnum) {
    if (!name) this.#assignDefaultStatus();
  }
  #assignDefaultStatus() {
    this.name = TransactionStatusEnum.PENDING;
  }
}
