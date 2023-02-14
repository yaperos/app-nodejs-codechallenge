import { Types } from 'mongoose';

export class ExternalTransactionDto {
  transactionExternalId: Types.ObjectId;
  transactionStatus: { name: string };
  transactionType: { name: string };
  value: number;
  createdAt: Date;
}
