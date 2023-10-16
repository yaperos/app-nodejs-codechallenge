import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class NewTransactionInput {
  @Field(() => String, { nullable: false })
  readonly cardId: string;

  @Field(() => Number, { nullable: false })
  readonly amount: number;
}
