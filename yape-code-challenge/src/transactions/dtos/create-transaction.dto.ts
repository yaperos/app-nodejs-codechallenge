import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTransactionDTO {
  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field()
  transferTypeId: number;

  @Field()
  value: number;
}
