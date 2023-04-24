import { ApiProperty } from "@nestjs/swagger";
import { TransactionEntity } from "./transaction.entity";
// import { YapeTransaction } from '@prisma/client';

export const ObjectTransactionTypes = {
    1 : "deposit",
    2 : "withdraw",
    3 : "transfer"
}
export const ObjectTransactionStatus = {
    1 : "pending",
    2 : "approved",
    3 : "rejected"
}
export class TransactionType {
    @ApiProperty()
    name: string;
  }
  
  export class TransactionStatus {
    @ApiProperty()
    name: string;
  }


export class TransactionResponseEntity {

    @ApiProperty()
    transactionExternalId: string;
  
    @ApiProperty({
      type: () => TransactionType
    })
    transactionType: TransactionType;
  
    @ApiProperty({
      type: () => TransactionStatus
    })
    transactionStatus: TransactionStatus;
  
    @ApiProperty()
    value: number;
  
    @ApiProperty()
    createdAt: Date;
  
  }
  
