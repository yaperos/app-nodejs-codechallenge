import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class TransactionStatus {
  @Field()
  name!: string;
}

@ObjectType()
export class TransactionType {
  @Field()
  name!: string;
}

@ObjectType()
export class TransactionOutput {
  @Field()
  transactionExternalId!: string;

  @Field(() => TransactionType)
  transactionType!: TransactionType;

  @Field(() => TransactionStatus)
  transactionStatus!: TransactionStatus;

  @Field(() => Float)
  value!: number;

  @Field(() => Date)
  createdAt!: Date;
}
