import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TransactionTypeDto {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
