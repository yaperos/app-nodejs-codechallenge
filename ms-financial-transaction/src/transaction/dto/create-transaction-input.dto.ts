import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInputDto {
  @Field(() => Float)
  amount: number;
  @Field()
  accountExternalIdDebit: string;
  @Field()
  accountExternalIdCredit: string;
  @Field()
  transferType: 'DEBIT' | 'CREDIT';
}
