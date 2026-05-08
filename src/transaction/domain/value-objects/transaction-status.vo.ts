const FINAL = new Set(['approved', 'rejected']);

export class TransactionStatusVo {
  private constructor(private readonly value: string) {}

  static pending(): TransactionStatusVo {
    return new TransactionStatusVo('pending');
  }

  static from(name: string): TransactionStatusVo {
    if (!['pending', 'approved', 'rejected'].includes(name)) {
      throw new Error(`Invalid transaction status: ${name}`);
    }
    return new TransactionStatusVo(name);
  }

  toString(): string {
    return this.value;
  }

  isFinal(): boolean {
    return FINAL.has(this.value);
  }
}
