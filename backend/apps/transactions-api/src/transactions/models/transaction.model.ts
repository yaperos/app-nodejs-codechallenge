import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import { TransactionStatusEnum } from "apps/transactions-api/src/transactions/enums/transaction-status.enum";


@ObjectType()
export class Transaction {
  @Field(() => String)
  readonly transactionExternalId: string;

  @Field(() => String)
  readonly transactionTypeName: string;

  @Field(() => TransactionStatusEnum)
  readonly transactionStatus: TransactionStatusEnum;

  @Field(() => Int)
  readonly value: number;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: Date;
}