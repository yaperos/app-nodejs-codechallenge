/* eslint-disable prettier/prettier */
export class UpdateTransactionRequest {
  transactionId?: number;
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
  tranferTypeId?: number;
  amount?: number;
  status: string;
}
