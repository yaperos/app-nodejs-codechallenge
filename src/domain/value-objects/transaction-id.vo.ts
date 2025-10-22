import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class TransactionId {
  constructor(public readonly value: string = uuidv4()) {
    this.validate();
  }

  private validate(): void {
    if (!uuidValidate(this.value)) {
      throw new Error('Invalid TransactionId format');
    }
  }

  equals(transactionId: TransactionId): boolean {
    return this.value === transactionId.value;
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }

  static generate(): TransactionId {
    return new TransactionId();
  }
}