import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Description {
  @Field({
    nullable: false,
  })
  name: string;
}

@ObjectType()
export class Transaction {
  @Field({ nullable: false })
  transactionExternalId: string;

  @Field(() => Description, {
    nullable: false,
  })
  transactionStatus: Description;

  @Field(() => Description, {
    nullable: false,
  })
  transactionType: Description;

  @Field(() => Int, {
    nullable: false,
  })
  value: number;

  @Field({
    nullable: false,
  })
  createdAt: string;

  @Field({
    nullable: false,
  })
  updatedAt: string;
}
