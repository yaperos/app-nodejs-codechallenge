export class ExternalCreditAccount {
  id: string;

  accountNumber: string;
  currency: string;
  country: string;
  holderName: string;
  holderDocument?: string;
  creditLimit: number;

  createdAt: Date;
  updatedAt?: Date;
}
