export class UpdateTransactionStatusCommand {
  constructor(
    public readonly transactionId: string,
    public readonly statusId: number,
  ) {}
}
