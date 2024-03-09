export class CreateTransactionServiceRes {
  ok: boolean;
  message: string;
  transactionId?: number;

  constructor(ok: boolean, message: string, transactionId?: number) {
    this.ok = ok;
    this.message = message;
    this.transactionId = transactionId;
  }
}