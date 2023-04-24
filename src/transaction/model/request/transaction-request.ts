import { Field, InputType, Int} from "@nestjs/graphql";

@InputType("TransactionRequest",{ description: 'transaction list to save' })
export class TransactionRequest{
  @Field((type)=> [TransactionData] , {description: 'Transaction information'})
  transactionRequest: TransactionData[]
}

@InputType({ description: 'Object Transaction' })
export class TransactionData {
  @Field((type) => String)
  accountExternalIdDebit: string;
  @Field((type) => String)
  accountExternalIdCredit: string;
  @Field((type) => Int)
  transactionType: number;
  @Field((type) => Int)
  value: number;
}
