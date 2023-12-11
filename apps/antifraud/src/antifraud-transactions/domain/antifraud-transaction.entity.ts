import { AggregateRoot } from '@app/common';

export class Transaction extends AggregateRoot {
  constructor(
    public id: string,
    public amount: number,
    public status?: string,
  ) {
    super();
  }

  validateAmount() {
    this.status = 'approved';

    if (this.amount > 1000) {
      this.status = 'rejected';
    }
  }

  toPrimitives() {
    return { id: this.id, amount: this.amount, status: this.status };
  }
}
