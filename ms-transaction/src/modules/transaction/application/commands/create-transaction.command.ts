export class CreateTransactionCommand {
  constructor(
    private readonly id: string,
    private readonly creditAccountExternalId: string,
    private readonly debitAccountExternalId: string,
    private readonly amount: number,
    private readonly transferType: string,
  ) {}

  public getId(): string {
    return this.id;
  }

  public getCreditAccountExternalId(): string {
    return this.creditAccountExternalId;
  }

  public getDebitAccountExternalId(): string {
    return this.debitAccountExternalId;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getTransferType(): string {
    return this.transferType;
  }
}
