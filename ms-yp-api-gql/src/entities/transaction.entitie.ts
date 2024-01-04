import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Transaction {
  @Field(() => String)
  accountExternalIdDebit: string;
  @Field(() => String)
  accountExternalIdCredit: string;
  @Field(() => Int)
  tranferTypeId: number;
  @Field(() => Int)
  value: number;
  @Field(() => String)
  id: string;
  @Field(() => String)
  transactionStatus: string;
  @Field(() => String)
  createdAt: string;
  @Field(() => String)
  updatedAt: string;
}
