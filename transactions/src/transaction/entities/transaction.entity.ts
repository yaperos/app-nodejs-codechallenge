import { ObjectType, Field, InputType, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Transaction {
  @Field(() => ID)
  accountExternalIdDebit: string;
  @Field(() => ID)
  accountExternalIdCredit: string;
  @Field(() => ID)
  tranferTypeId: number;
  @Field()
  value: number;

  @Field(() => ID)
  transactionExternalId: string;

  @Field()
  transactionType: string;

  @Field()
  transactionStatus: string;

  @Field()
  createdAt?: Date;
}
