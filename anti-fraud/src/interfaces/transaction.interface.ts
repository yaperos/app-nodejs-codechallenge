export interface ITransaction {
  id: string;
  transferTypeId: number;
  value: number;
  status: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  createdAt: Date;
}
