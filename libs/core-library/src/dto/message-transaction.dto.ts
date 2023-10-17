export class MessageTransactionDto {
  constructor(
    public readonly transactionExternalId: string,
    public readonly transactionStatusId: number,
    public readonly value: number,
  ) {}

  toString() {
    return JSON.stringify({
      transactionExternalId: this.transactionExternalId,
      transactionStatusId: this.transactionStatusId,
      value: this.value,
    });
  }
}
