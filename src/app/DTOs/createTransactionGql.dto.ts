import { InputType, Field, Int, Float } from "@nestjs/graphql";
import { TransactionEntity } from '../entity/transaction.entity';

@InputType()
export class CreateTransactionGqlDto extends  TransactionEntity{
  @Field()
  accountExternalIdCredit: string;

  @Field()
  accountExternalIdDebit: string;

  @Field(type => Int)
  transferTypeId: number;
  
  @Field(type => Float)
  value: number;
}