export interface ITransaction {
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
  tranferTypeId: number;
  value: number;
  status: string;
  updateAt?: Date;
  id?: string;
}
