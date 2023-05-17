import { InputType, Int, Field, ObjectType, ID } from '@nestjs/graphql';

@InputType()
 export class Name {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;
}

@InputType()
export class CreateTransactionInput {
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

}