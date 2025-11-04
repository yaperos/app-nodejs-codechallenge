import { Field, ObjectType, Float, registerEnumType } from "@nestjs/graphql";

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

registerEnumType(TransactionStatus, {
  name: 'TransactionStatus',
});

@ObjectType()
export class TransactionEntity {
  @Field(() => String)
  transactionExternalId: string;  

  @Field(() => String)
  accountExternalIdDebit: string;

  @Field(() => String)
  accountExternalIdCredit: string;

  @Field(() => Float)
  value: number

  @Field(() => TransactionStatus)
  status: TransactionStatus;

  @Field(() => Date)
  createdAt: Date;
}