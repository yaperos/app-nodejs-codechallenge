import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType('Transaction') 
export class TransactionType {
  @Field()
  transactionExternalId: string;

  @Field()
  status: string;

  @Field(() => Float)
  value: number;

  @Field()
  createdAt: Date;
}