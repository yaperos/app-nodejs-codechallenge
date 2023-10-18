import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class transactionTypeEntity {
  @Field(() => Int)
  transactionExternalIdType: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  key: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}

@ObjectType()
export class ITransactionStatus {
  @Field(() => Int)
  transactionExternalIdStatus: number;

  @Field(() => String)
  key: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}

@ObjectType()
export class TransactionEntity {
  @Field(() => String)
  transactionExternalId: string;

  @Field(() => String)
  accountExternalIdDebit: string;

  @Field(() => String)
  accountExternalIdCredit: string;

  @Field(() => Int)
  transactionTypeId: number;

  @Field(() => transactionTypeEntity)
  transactionType: transactionTypeEntity;

  @Field(() => Number)
  value: number;

  @Field(() => Int)
  transactionStatusId: number;

  @Field(() => ITransactionStatus)
  transactionStatus: ITransactionStatus;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
