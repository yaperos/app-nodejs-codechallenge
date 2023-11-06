export class ValidateTransactionQuery {
  constructor(
    public readonly transactionId: string,
    public readonly value: number,
  ) {}
}
