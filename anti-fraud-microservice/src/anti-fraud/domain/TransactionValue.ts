export class TransactionValue {
  constructor(public value: number) {}
  isValid() {
    return this.value < 1000;
  }
}
