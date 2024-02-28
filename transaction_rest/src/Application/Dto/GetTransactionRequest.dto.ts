import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GeTransactionRequest {
  @Field()
  idTransaction: string;
}
