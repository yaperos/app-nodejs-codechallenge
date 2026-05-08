export class MoneyVo {
  private constructor(private readonly amount: number) {}

  static of(value: number): MoneyVo {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error('Amount must be a non-negative finite number');
    }
    return new MoneyVo(value);
  }

  exceeds(limit: number): boolean {
    return this.amount > limit;
  }

  toNumber(): number {
    return this.amount;
  }
}
