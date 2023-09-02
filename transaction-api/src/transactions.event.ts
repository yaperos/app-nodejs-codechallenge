import { TransactionStatus } from './common/commonTypes';

export class TransactionCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly transferType: number,
    public readonly amount: number,
  ) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      transferType: this.transferType,
      amount: this.amount,
    });
  }
}

export class TransactionValidatedEvent {
  constructor(
    public readonly id: string,
    public readonly status: TransactionStatus,
  ) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      status: this.status,
    });
  }
}
