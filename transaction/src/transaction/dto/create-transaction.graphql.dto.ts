import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTransactionGraphqlDto {
  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit?: string;

  @Field()
  tranferTypeId: string;

  @Field()
  value: number;
}
