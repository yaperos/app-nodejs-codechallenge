import { Field, InputType } from '@nestjs/graphql';

interface IRetrieveTransactionInput {
  transactionId: string;
}

@InputType()
export class RetrieveTransactionInput implements IRetrieveTransactionInput {
  @Field()
  transactionId: string;
}
