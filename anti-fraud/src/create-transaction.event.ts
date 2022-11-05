export class CreateTransactionEvent {
  constructor(
    public readonly id: number,
    public readonly transactionExternalId: string,
    public readonly transactionStatus: string,
    public readonly amount: number,
  ) {}
}
