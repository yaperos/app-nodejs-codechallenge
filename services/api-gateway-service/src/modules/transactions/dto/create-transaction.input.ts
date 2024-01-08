import { InputType, Int, Field, ID, Float, Directive } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field(() => ID)
  accountExternalIdDebit: string;

  @Field(() => ID)
  accountExternalIdCredit: string;

  @Directive('@constraint(max: 3)')
  @Field(() => Int)
  tranferTypeId: number;

  @Field(() => Float)
  value: number;
}
