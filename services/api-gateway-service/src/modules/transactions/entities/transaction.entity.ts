import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Transaction {
  @Field(() => ID, { description: 'External transaction id' })
  transactionExternalId: string;

  @Field(() => String, { description: 'Transaction type description' })
  transactionType: string;

  @Field(() => String, { description: 'Transaction status' })
  transactionStatus: string;

  @Field(() => Float, { description: 'Transfer value' })
  value: number;

  @Field(() => String, { description: 'Transaction creation time' })
  createdAt: string;
}
