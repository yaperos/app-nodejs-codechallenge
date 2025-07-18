/**
 * RawTransaction model.
 */
export class RawTransaction {
  id: string;
  amount: number;
  currency: string;

  constructor(data: Partial<RawTransaction> = {}) {
    this.id = data.id || '';
    this.amount = data.amount || 0;
    this.currency = data.currency || '';
  }

  static builder(): RawTransactionBuilder {
    return new RawTransactionBuilder();
  }

  getId(): string {
    return this.id;
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }
}

/**
 * Builder class equivalent to Lombok @Builder functionality
 */
export class RawTransactionBuilder {
  private rawTransaction: Partial<RawTransaction> = {};

  id(id: string): RawTransactionBuilder {
    this.rawTransaction.id = id;
    return this;
  }

  amount(amount: number): RawTransactionBuilder {
    this.rawTransaction.amount = amount;
    return this;
  }

  currency(currency: string): RawTransactionBuilder {
    this.rawTransaction.currency = currency;
    return this;
  }

  build(): RawTransaction {
    return new RawTransaction(this.rawTransaction);
  }
}
