import { InputType, Int, Float, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field(() => String, { description: 'id of the account debited' })
  accountExternalIdDebit: string;
  @Field(() => String, { description: 'id of the account credited' })
  accountExternalIdCredit: string;
  @Field(() => Int, { description: 'id of the transfer type' })
  tranferTypeId: number;
  @Field(() => Float, { description: 'value of the transactions' })
  value: number;
}

