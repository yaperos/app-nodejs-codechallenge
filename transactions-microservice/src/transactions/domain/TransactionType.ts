export class TransactionType {
  public name: string;

  constructor() {
    this.#assignDefaultType();
  }
  #assignDefaultType() {
    this.name = '';
  }
}
