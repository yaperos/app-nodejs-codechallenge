import { Field, Float, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateTransactionInput {
  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field((type) => Int)
  transactionTypeId: number;

  @Field((type) => Float)
  value: number;
}
