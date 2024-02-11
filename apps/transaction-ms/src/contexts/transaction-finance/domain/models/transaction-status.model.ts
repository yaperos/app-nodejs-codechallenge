import { Directive, Field, ObjectType } from '@nestjs/graphql';

@ObjectType('transactionStatus')
@Directive('@key(fields: "name")')
export class TransactionStatusModel {
  @Field()
  name: string;
}
