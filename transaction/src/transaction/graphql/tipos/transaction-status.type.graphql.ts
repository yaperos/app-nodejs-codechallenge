import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('TransactionStatus')
export class TransactionStatusTypeGraphql {
  @Field()
  id: number;

  @Field()
  name: string;
}
