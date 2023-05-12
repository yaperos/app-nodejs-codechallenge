export class CreateTransactionEventDto{
  constructor(
    public readonly id: string,
    public readonly transactionExternalId: string,
    public readonly value: number,
    public readonly transactionStatus: number
  ){ }
}