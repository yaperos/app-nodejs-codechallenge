import { registerEnumType } from '@nestjs/graphql';

export enum TransferType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
  CASH = 'CASH',
}

registerEnumType(TransferType, {
  name: 'TransferType',
  description: undefined,
});
