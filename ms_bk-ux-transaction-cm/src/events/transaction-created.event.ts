export class TransactionCreatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly value: number,
    public readonly transferTypeId: number,
    public readonly statusId: number,
    public readonly transferTypeName: string,
    public readonly statusName: string,
    public readonly externalId: string,
    public readonly createdAt: Date,
  ) {}
}
