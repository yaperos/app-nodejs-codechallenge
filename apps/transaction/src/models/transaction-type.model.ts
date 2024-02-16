import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionTypeModel {
  @Field()
  id: number;

  @Field()
  name: string;
}
