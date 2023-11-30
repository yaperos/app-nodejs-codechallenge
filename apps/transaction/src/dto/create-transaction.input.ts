import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class TrasactionStatusInput {
  @Field()
  id: string;

  @Field()
  name: string;
}

@InputType()
export class TransactionTypeInput {
  @Field()
  id: string;

  @Field()
  name: string;
}

@InputType()
export class CreateTransactionInput {
  @Field(() => String, { description: 'External ID of the debit account' })
  accountExternalIdDebit: string;

  @Field(() => String, { description: 'External ID of the credit account' })
  accountExternalIdCredit: string;

  @Field(() => Int, { description: 'Value of the transaction' })
  value: number;

  @Field(() => Date, {
    description: 'Date of the transaction',
    nullable: true,
  })
  createdAt: string;

  @Field(() => String)
  tranferTypeId: string;
}
