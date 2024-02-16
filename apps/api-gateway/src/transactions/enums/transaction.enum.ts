import { registerEnumType } from '@nestjs/graphql';

export enum TransactionStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

registerEnumType(TransactionStatusEnum, {
  name: 'TransactionStatusEnum',
  description: 'Type of statuses on a transaction',
});
