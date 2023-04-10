import { Field, InputType, ObjectType } from 'type-graphql';

export interface ITransaction {
  id: number;
  tranferTypeId: number;
  status_id: number;
  value: number;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
}

@InputType()
export class TransactionCreateInput implements Partial<ITransaction> {
  @Field()
  tranferTypeId!: number;

  @Field()
  accountExternalIdDebit!: string;

  @Field()
  accountExternalIdCredit!: string;

  @Field()
  value!: number;
}

@ObjectType()
export class TransactionObjectType implements Partial<ITransaction> {
  @Field()
  id!: number;

  @Field()
  tranferTypeId!: number;

  @Field()
  status_id!: number;

  @Field(() => Number)
  value!: number;

  @Field()
  accountExternalIdDebit!: string;

  @Field()
  accountExternalIdCredit!: string;
}
