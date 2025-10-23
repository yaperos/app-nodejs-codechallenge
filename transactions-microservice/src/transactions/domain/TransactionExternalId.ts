import { randomUUID } from 'node:crypto';

export class TransactionExternalId {
  constructor(public value?: string) {
    if (!value) this.#generateExternalId();
  }
  #generateExternalId() {
    this.value = randomUUID();
  }
}
