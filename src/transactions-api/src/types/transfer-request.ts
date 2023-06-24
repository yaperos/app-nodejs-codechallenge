import { ObjectType } from '@nestjs/graphql';
import { TransactionStatus, TransactionType } from 'src/models/enums';

@ObjectType()
export class TransferRequest {
  transferExternalId: string;
  transactionType: {
    name: TransactionType;
  };
  transactionStatus: {
    name: TransactionStatus;
  };
  value: number;
  createdAt: Date;
}
