export interface DataTransaction {
  status: number;
  type: string;
  accountExternalIdCredit: string;
  accountExternalIdDebit: string;
  value: number;
  transactionExternalId: null | string;
  created_by: null | string;
  updated_by: null | string;
  deleted_by: null | string;
  updated_at: string;
  deleted_at: null | string;
  transaction_id: number;
  created_at: string;
}
