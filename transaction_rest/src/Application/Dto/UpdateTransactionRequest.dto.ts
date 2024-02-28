import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateTransactionRequest {
  @Field()
  idTransaction: string;
  @Field()
  status: string;
}
