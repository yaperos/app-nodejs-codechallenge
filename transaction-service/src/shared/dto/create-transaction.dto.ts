import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateTransactionDto {
  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field()
  tranferTypeId: number;

  @Field(() => Float)
  value: number;
}