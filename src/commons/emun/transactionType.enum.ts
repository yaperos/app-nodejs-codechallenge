import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum TransactionTypeEnum {
  'charge' = 'charge',
  'pay' = 'pay',
}

registerEnumType(TransactionTypeEnum, {
  name: 'TransactionType',
  description: 'Transaction type',
});
