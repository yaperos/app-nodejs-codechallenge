import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TransactionStatus } from '../transaction-status';
import { TransactionType } from '../transaction-type';

@ObjectType({description:"response"}) 
export class TransactionResponse {
  @Field((type)=> String , {nullable: true ,description: 'Transaction information'})
  transactionExternalId: string;
  @Field((type)=> TransactionType , {nullable: true ,description: 'Transaction information'})
  transactionType: TransactionType;
  @Field((type)=> TransactionStatus , {nullable: true ,description: 'Transaction information'})
  transactionStatus: TransactionStatus;
  @Field((type)=> Int , {nullable: true ,description: 'Transaction information'})
  valueTransaction: number;
  @Field((type)=> Date , {nullable: true ,description: 'Transaction information'})
  createdAt: Date;
}

