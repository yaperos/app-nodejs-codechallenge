export class UpdateTransactionMessage {

  id: number;
  amount: number;
  status: number;
  type: number;
  createdAt: Date;
  accountCreditId: string;
  accountDebitId: string;
  uuid: string;

}
