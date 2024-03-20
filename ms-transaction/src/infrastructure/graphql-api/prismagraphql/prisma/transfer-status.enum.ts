import { registerEnumType } from '@nestjs/graphql';

export enum TransferStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

registerEnumType(TransferStatus, {
  name: 'TransferStatus',
  description: undefined,
});
