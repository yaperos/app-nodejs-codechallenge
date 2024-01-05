import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Transaction {
  @Field(() => String, { description: 'Example field (placeholder)' })
  status: string;
}
