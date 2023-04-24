import { registerEnumType } from '@nestjs/graphql';

export enum TransactionStatusEnum {
  'pending' = 'pending',
  'approved' = 'approved',
  'rejected' = 'rejected',
}

registerEnumType(TransactionStatusEnum, {
  name: 'TransactionStatus',
  description: 'status of the transaction',
});
