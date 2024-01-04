import { InputType, Int, Field } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Min(1)
  @Field(() => Int)
  value: number;

  @Min(1)
  @Field(() => Int)
  tranferTypeId: number;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;
}
