export interface Transaction {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status: 'approved' | 'rejected';
  createdAt: Date;
}