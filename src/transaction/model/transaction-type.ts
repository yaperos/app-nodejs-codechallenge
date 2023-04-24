import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionType {
  @Field(type => String, { description: 'name transaction type' })
  name: string;
}
