export class TransactionCreatedEvent {
    constructor(
      public readonly id: string,
      public readonly v: number,
    ) {}
  
    toString() {
      return JSON.stringify({
        id: this.id,
        v: this.v
      });
    }
  }