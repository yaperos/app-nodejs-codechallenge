import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NameType {
  @Field()
  name: string;
}

@ObjectType()
export class TransactionType {
  @Field()
  transactionExternalId: string;

  @Field((type) => NameType)
  transactionType: NameType;

  @Field((type) => NameType)
  transactionStatus: NameType;

  @Field((type) => Int)
  value: number;

  @Field((type) => Date)
  createdAt: Date;
}
