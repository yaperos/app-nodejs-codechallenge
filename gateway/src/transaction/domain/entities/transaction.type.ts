export class Transaction {
  id?: number;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
