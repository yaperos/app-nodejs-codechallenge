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

export interface BaseStatusTransaction {
  name: string;
  transactionId: string;
  createdAt: Date;
}

export interface StatusTransaction extends BaseStatusTransaction {
  id: string;
}

export type CallbackPayload = {
  id: string;
  name: string;
}