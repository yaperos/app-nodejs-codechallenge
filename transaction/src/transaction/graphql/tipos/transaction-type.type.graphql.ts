import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('TransactionType')
export class TransactionTypeTypeGraphql {
  @Field()
  id: number;

  @Field()
  name: string;
}
