import { InputType, Field, ID, Float, Int } from '@nestjs/graphql';

interface ICreateTransactionInput {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
}

@InputType()
export class CreateTransactionInput implements ICreateTransactionInput {
  @Field(() => ID)
  accountExternalIdDebit: string;

  @Field(() => ID)
  accountExternalIdCredit: string;

  @Field(() => Int)
  transferTypeId: number;

  @Field(() => Float)
  value: number;
}
