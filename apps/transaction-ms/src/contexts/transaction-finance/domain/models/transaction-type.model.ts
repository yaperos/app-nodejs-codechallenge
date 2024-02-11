import { Directive, Field, ObjectType } from '@nestjs/graphql';

@ObjectType('transactionType')
@Directive('@key(fields: "name")')
export class TransactionTypeModel {
  @Field()
  name: string;
}
