import { registerEnumType } from "@nestjs/graphql";

export enum TransactionStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

registerEnumType(TransactionStatusEnum, {
  name: 'TransactionStatus',
  description: 'The status of a transaction',
});