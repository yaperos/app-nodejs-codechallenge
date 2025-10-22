export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'PEN',
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    if (!this.currency || this.currency.length !== 3) {
      throw new Error('Invalid currency code');
    }
  }

  add(money: Money): Money {
    if (this.currency !== money.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + money.amount, this.currency);
  }

  subtract(money: Money): Money {
    if (this.currency !== money.currency) {
      throw new Error('Cannot subtract different currencies');
    }
    if (this.amount < money.amount) {
      throw new Error('Insufficient amount');
    }
    return new Money(this.amount - money.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  equals(money: Money): boolean {
    return this.amount === money.amount && this.currency === money.currency;
  }

  isGreaterThan(money: Money): boolean {
    if (this.currency !== money.currency) {
      throw new Error('Cannot compare different currencies');
    }
    return this.amount > money.amount;
  }

  isLessThan(money: Money): boolean {
    if (this.currency !== money.currency) {
      throw new Error('Cannot compare different currencies');
    }
    return this.amount < money.amount;
  }

  toJSON(): object {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }
}