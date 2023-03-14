interface TransactionRequest {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
}
export class CreateTransactionRequest {
  constructor(private readonly transaction: TransactionRequest) {}
  toString() {
    return JSON.stringify(this.transaction);
  }
}
