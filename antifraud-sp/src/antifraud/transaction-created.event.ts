export class TransactionCreatedEvent {
  constructor(
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly tranferTypeId: number,
    public transactionStatus: string,
    public readonly transactionType: string,
    public transactionExternalId: string,
    public readonly value: number,
  ) {}
}
