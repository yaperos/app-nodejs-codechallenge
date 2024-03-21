import { registerEnumType } from '@nestjs/graphql';

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

registerEnumType(TransactionStatus, {
  name: 'TransactionStatus',
});