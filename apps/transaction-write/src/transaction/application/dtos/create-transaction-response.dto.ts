import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateTransactionResponse {
  @Field(() => String, { description: 'Id externo' })
  readonly transactionExternalId: string;
}
