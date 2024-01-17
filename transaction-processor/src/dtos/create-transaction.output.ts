
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class CreateTransactionOutputDto {
  @Field(() => ID)
  public transactionExternalId!: string;

  @Field()
  public accountExternalIdDebit!: string;

  @Field()
  public accountExternalIdCredit!: string;

  @Field(() => Float)
  public value!: number;

  @Field()
  public createdAt!: Date;
}