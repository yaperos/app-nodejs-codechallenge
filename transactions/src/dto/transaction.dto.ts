export class TransactionDto {
  constructor(
    public readonly transactionExternalId: string,
    public readonly transactionType: number,
    public readonly value: number,
    public readonly transactionStatus: string,
    public readonly createdAt: Date,
  ) {}
}
