import { TransactionStatus } from './transaction-status.enum';

export class TransactionCreated {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly status: TransactionStatus,
  ) {}
}
