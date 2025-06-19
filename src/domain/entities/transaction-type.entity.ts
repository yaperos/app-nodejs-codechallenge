export interface ITransactionType {
  id: number;
  name: string;
}

export class TransactionTypeEntity implements ITransactionType {
  constructor(
    public readonly id: number,
    public readonly name: string,
  ) {}

  static transfer(): TransactionTypeEntity {
    return new TransactionTypeEntity(1, 'Transfer');
  }

  static payment(): TransactionTypeEntity {
    return new TransactionTypeEntity(2, 'Payment');
  }

  static withdrawal(): TransactionTypeEntity {
    return new TransactionTypeEntity(3, 'Withdrawal');
  }

  isTransfer(): boolean {
    return this.id === 1;
  }
} 