import { DomainEvent } from "../../../../Contexts/Shared/domain/DomainEvent";

export type TransactionEventBody = {
  readonly id: string;
  readonly value: number;
};

export class TransactionCreated extends DomainEvent {
  static readonly EVENT_NAME = 'TRANSACTION_CREATED';
  readonly id: string;
  readonly value: number;

  constructor(data: {
    id: string;
    value: number;
  }) {
    super(TransactionCreated.EVENT_NAME, '');
    this.id = data.id;
    this.value = data.value;
  }

  getValue(): number {
    return this.value;
  }

  getId(): string {
    return this.id;
  }

  static fromPrimitives(body: TransactionEventBody): DomainEvent {
    return new TransactionCreated({
      id: body.id,
      value: body.value
    });
  }

  toPrimitive(): Record<string, any> {
    const {
      id,
      value
    } = this;
    return {
      id,
      value
    };
  }
}
