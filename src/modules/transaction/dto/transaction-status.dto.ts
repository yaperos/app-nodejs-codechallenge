import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TransactionStatusDto {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
