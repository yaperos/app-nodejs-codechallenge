import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class TransactionInputDto {
  @Field()
  public readonly accountExternalIdDebit!: string;

  @Field()
  public readonly accountExternalIdCredit!: string;

  @Field(() => Int)
  public readonly transferTypeId!: number;

  @Field(() => Float)
  public readonly value!: number;
}