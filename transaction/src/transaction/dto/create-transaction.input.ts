import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field(() => Int)
  value: number;

  @Field(() => Int)
  tranferTypeId: number;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;
}
