import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Transaction as TransactionDB } from '@prisma/client';

@ObjectType()
class TransactionTypes {
  @Field(() => String, { nullable: true })
  name: string;
}

@ObjectType()
class TransactionStatusType {
  @Field(() => String, { nullable: true })
  name: string;
}

@ObjectType()
export class TransactionModel {
  @Field(() => String, { nullable: true })
  transactionExternalId: TransactionDB[`id`];

  @Field({ nullable: true })
  transactionType: TransactionTypes;

  @Field({ nullable: true })
  transactionStatus: TransactionStatusType;

  @Field(() => Number, { nullable: true })
  value: TransactionDB[`value`];

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;
}

@ObjectType()
export class TransactionCreateModel {
  @Field(() => String, { nullable: true })
  transactionExternalId: TransactionDB[`id`];

  @Field(() => String, { nullable: true })
  accountExternalIdDebit: TransactionDB[`accountExternalIdDebit`];

  @Field(() => String, { nullable: true })
  accountExternalIdCredit: TransactionDB[`accountExternalIdCredit`];

  @Field(() => Int, { nullable: true })
  transactionTypeId: TransactionDB[`transactionTypeId`];

  @Field(() => Int, { nullable: true })
  transactionStatusId: TransactionDB[`transactionStatusId`];

  @Field(() => Number, { nullable: true })
  value: TransactionDB[`value`];

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;
}
