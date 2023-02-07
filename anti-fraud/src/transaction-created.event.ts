/* eslint-disable prettier/prettier */
export class TransactionCreatedEvent {
  constructor(
    public readonly transactionId: number,
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly tranferTypeId: number,
    public readonly amount: number,
    public readonly status: string,
    public readonly createdAt: string,
  ) {}

}
