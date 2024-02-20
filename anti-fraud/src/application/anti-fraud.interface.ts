export interface IAntiFraudRequest {
  id: string;
  transferTypeId: number;
  value: number;
  status: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  createdAt?: Date;
}

export interface IAntiFraudEvent {
  transactionExternalId: string;
  value: number;
  status: string;
}
