/* eslint-disable prettier/prettier */
export class CreateTransactionRequest{
  accountExternalIdDebit: string
  accountExternalIdCredit: string;
  tranferTypeId: number;
  amount: number;
  status:string;
}