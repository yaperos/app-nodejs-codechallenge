import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionstatusInput {
  @Field()
  name: string;
}
