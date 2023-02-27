import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  accountExternalIdDebit: string;

  @Field(() => String)
  accountExternalIdCredit: string;

  @Field(() => Int)
  transactionTypeId: number;

  @Field(() => Number)
  value: number;
}
