import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field({ nullable: true })
  idempotencyKey?: string;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field(() => Int)
  transferTypeId: number;

  @Field(() => Float)
  value: number;
}
