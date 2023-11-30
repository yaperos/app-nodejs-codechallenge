import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Antifraud {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
