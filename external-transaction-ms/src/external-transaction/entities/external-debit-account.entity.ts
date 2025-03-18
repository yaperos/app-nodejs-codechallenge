export class ExternalDebitAccount {
  id: string;

  accountNumber: string;
  expirationDate: Date;
  country: string;
  holderName: string;
  holderDocument?: string;
  balance: number;

  createdAt: Date;
  updatedAt?: Date;
}
