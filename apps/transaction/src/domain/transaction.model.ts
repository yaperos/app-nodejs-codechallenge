export class TransactionModel {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  status: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}
