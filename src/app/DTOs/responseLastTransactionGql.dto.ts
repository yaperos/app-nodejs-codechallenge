import { ObjectType, Field } from "@nestjs/graphql";
import { ResponseCreateTransactionGlqDto } from "./responseCreateTransactionGql.dto";

@ObjectType()
class TransactionTypeResponse {
  @Field()
  name: string;
}

@ObjectType()
class TransactionStatus {
  @Field()
  name: string;
}

@ObjectType()
class ResponseLastTransaction {
  @Field()
  transactionExternalId: string;
  @Field(() => TransactionTypeResponse)
  transactionType: TransactionTypeResponse;
  @Field(() => TransactionStatus)
  transactionStatus: TransactionStatus;
  @Field()
  value: number;
  @Field({ nullable: true }) 
  createdAt: Date;
}

@ObjectType()
export class ResponseLastTransactionGqlDto extends ResponseCreateTransactionGlqDto {
  @Field(() => ResponseLastTransaction)
  data: ResponseLastTransaction;
}