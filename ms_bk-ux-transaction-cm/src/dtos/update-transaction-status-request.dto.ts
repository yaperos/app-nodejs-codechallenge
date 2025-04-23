export class UpdateTransactionStatusRequestDto {
  constructor(
    public readonly transactionStatusId: number,
    public readonly externalId: string,
  ) {}
}
