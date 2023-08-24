export interface AntiFraudRequest {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status: string;
}