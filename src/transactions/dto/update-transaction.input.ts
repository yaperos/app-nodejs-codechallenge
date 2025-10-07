import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateTransactionInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  status?: string;
}
