export interface Transaction {
  idDebit: string;
  idCredit: string;
  transferTypeId: number;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
