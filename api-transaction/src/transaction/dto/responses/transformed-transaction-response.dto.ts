import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
class TransactionType {
  @Field(() => String)
  name: string;
}

@ObjectType()
class TransactionStatus {
  @Field(() => String)
  name: string;
}

@ObjectType()
export class TransformedTransaction {
  @Field(() => ID)
  transactionExternalId: string;
  @Field(() => TransactionType) 
  transactionType: TransactionType;
  @Field(() => TransactionStatus) 
  transactionStatus: TransactionStatus;
  @Field(() => Int)
  value: number;
  @Field(() => String)
  createdAt: string;
}

