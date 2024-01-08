import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionDto {
  @Field()
  public id!: number;

  @Field()
  public accountExternalIdDebit!: string;

  @Field()
  public accountExternalIdCredit!: string;

  @Field()
  public transferTypeId!: number;

  @Field()
  public value!: number;

  @Field()
  public status!: string;
}
