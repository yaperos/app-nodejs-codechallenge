import { IEvent } from '@nestjs/cqrs';

export class TransactionCreatedEvent implements IEvent {
  constructor(
    public readonly transactionExternalId: string,
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly value: number,
    public readonly createdAt: string,
  ) {}
}