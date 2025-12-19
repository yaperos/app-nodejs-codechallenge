import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionTypeOutputDto {
  @Field()
  name: string;
}
