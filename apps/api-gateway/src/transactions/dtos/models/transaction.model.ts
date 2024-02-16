import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { TransactionStatusEnum } from 'apps/api-gateway/src/transactions/enums/transaction.enum';

@ObjectType()
export class Transaction {
  @Field(() => String)
  readonly uuid: string;

  @Field(() => Int)
  readonly amount: number;

  @Field(() => TransactionStatusEnum)
  readonly status: TransactionStatusEnum;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: Date;
}
