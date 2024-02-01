export interface TransferRequest {
  id: number;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  status: string;
  amount: number;
}
