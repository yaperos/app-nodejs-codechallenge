export interface BaseTransaction {
  accountExternalIdDebit: string;
  accountExternalIdCredit: String;
  tranferTypeId: number;
  value: number;
  createdAt: Date;
}

export interface Transaction extends BaseTransaction {
  id: string;
}

export interface TypeTransaction {
  id: number;
  name: string;
}