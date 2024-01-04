import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateTransactionDto {
  @Field(() => String)
  accountExternalIdDebit: string;
  @Field(() => String)
  accountExternalIdCredit: string;
  @Field(() => Int)
  tranferTypeId: number;
  @Field(() => Int)
  value: number;
}
