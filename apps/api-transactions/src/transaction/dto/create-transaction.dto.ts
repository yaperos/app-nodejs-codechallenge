import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTransactionDto {
  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field()
  tranferTypeId: number;

  @Field()
  value: number;
}
