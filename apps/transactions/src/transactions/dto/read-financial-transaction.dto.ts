import { Named } from '@/transactions/interfaces/named.interface';

export interface ReadFinancialTransactionDTO {
  transactionExternalId: string;
  transactionType: Named;
  transactionStatus: Named;
  value: number;
  createdAt: Date;
}
