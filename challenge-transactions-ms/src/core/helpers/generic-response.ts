import { TransactionVerify } from 'src/module/domain/aggregates/transaction-verify';

export class TransactionGenericApiResponse {
  constructor(
    public data: TransactionVerify | null | [] = null,
    public message: string = 'success',
    public statusCode?: number,
  ) {
    this.message = this.data === null ? 'empty' : 'success';
  }
}
