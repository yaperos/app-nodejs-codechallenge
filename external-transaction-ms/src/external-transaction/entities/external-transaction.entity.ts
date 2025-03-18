export class ExternalTransaction {
  id: string;

  externalDebitAccountId: string;
  externalCreditAccountId: string;

  typeId: number;
  statusId: number;
  transferId: number;

  value: number;

  createdAt: Date;
  updatedAt?: Date;
}
