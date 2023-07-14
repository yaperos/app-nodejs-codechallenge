import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionStatusModel {
  @Field()
  name: string;
}
