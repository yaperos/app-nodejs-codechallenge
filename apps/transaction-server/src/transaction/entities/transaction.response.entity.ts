import { ApiProperty } from "@nestjs/swagger";
import { TransactionType } from "./transaction-type.entity";
import { TransactionStatus } from "./transaction-status.entity";
import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('Transaction')
export class TransactionResponseEntity {

    @Field()
    @ApiProperty()
    transactionExternalId: string;
  

    @Field()
    transactionStatusId: number;

    @Field()
    accountExternalIdDebit: string;

    @Field()
    accountExternalIdCredit: string;

    @Field()
    tranferTypeId: number;

    @Field()
    @ApiProperty({
      type: () => TransactionType
    })
    transactionType: TransactionType;
  
    @Field()
    @ApiProperty({
      type: () => TransactionStatus
    })
    transactionStatus: TransactionStatus;
  
    @Field()
    @ApiProperty()
    value: number;
  
    @Field()
    @ApiProperty()
    createdAt: Date;
  
  }
  
