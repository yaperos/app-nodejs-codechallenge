import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class TransactionType {
  @Field()
  name: string;
}

@ObjectType()
class TransactionStatus {
  @Field()
  name: string;
}

@ObjectType()
export class Transaction {
  @Field()
  transactionId: string;

  @Field(() => TransactionType)
  transactionType: TransactionType;

  @Field(() => TransactionStatus)
  transactionStatus: TransactionStatus;

  @Field()
  value: number;

  @Field()
  createdAt: string;
}
