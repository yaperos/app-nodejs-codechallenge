export interface ITransactionEvent {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  id: string;
}
export class CreateTransactionEvent {
  constructor(public transaction: ITransactionEvent) {}
  toString() {
    return JSON.stringify(this.transaction);
  }
}
