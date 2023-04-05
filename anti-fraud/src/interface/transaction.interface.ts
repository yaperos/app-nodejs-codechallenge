export interface ITransaction {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  status: number;
  value: number;
  createdAt: Date;
}
