export class Transaction {
  constructor(
    public id: string,
    public accountExternalIdDebit: string,
    public accountExternalIdCredit: string,
    public tranferTypeId: number,
    public value: number,
    public status: 'pending' | 'approved' | 'rejected',
    public createdAt: Date,
  ) {}
}