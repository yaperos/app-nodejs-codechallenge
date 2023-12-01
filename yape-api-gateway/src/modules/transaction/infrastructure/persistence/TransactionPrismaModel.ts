import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Transaction {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field({
    nullable: true,
    description:
      'UUID of the account from which the transaction amount is debited',
  })
  @Field(() => String, {
    nullable: true,
  })
  accountExternalIdDebit: string;

  @Field(() => String, {
    nullable: true,
    description:
      'UUID of the account from which the transaction amount is credited',
  })
  accountExternalIdCredit: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => Number)
  value: number;

  @Field(() => Number)
  status: number;

  @Field(() => Number, { description: 'transaction type id' })
  transferTypeId: number;
}
