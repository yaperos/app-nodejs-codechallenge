import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TransactionType } from './transaction-type.entity';
import { TransactionStatus } from './transaction-status.entity';

@ObjectType()
export class Transaction {
    @Field()
    id: string;
  
    @Field()
    accountExternalIdDebit: string;
  
    @Field()
    accountExternalIdCredit: string;
  
    @Field(() => Int)
    value: number;
  
    @Field(() => Int)
    tranferTypeId: number;
  
    @Field()
    createdAt: Date;
  
    @Field({ nullable: true })
    updatedAt?: Date;
  
    @Field(() => Int, { nullable: true })
    transactionStatusId?: number;
  
    @Field(() => TransactionType, { nullable: true })
    transactionType?: TransactionType;
  
    @Field(() => TransactionStatus, { nullable: true })
    transactionStatus?: TransactionStatus;
}
