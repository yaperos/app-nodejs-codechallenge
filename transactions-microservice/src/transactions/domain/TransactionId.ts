import { randomUUID } from 'node:crypto';

export class TransactionId {
  constructor(public value?: string) {
    if (!value) this.#generateUuid();
  }
  #generateUuid() {
    this.value = randomUUID();
  }
}
