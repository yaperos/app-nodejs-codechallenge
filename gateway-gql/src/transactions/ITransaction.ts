export interface ITransaction {
  transaction_external_id: string;
  account_external_id_debit: string;
  account_external_id_credit: string;
  transaction_type_id: number;
  value: number;
  transaction_status_id: number;
  created_at: string;
  updated_at: string;
  transaction_type: ItransactionType;
  transaction_status: ITransactionStatus;
}
interface ItransactionType {
  transaction_type_id: number;
  name: string;
  key: string;
  description: string;
  created_at: string;
  updated_at: string;
}
interface ITransactionStatus {
  transaction_status_id: number;
  key: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}
