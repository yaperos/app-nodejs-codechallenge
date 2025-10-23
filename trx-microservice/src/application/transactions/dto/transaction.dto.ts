import { IsIn, IsNumber, IsUUID, Min } from "class-validator";
import { TRANSFER_TYPES } from "src/domain/transactions/transaction";

export class CreateTransactionDto {
    @IsUUID(4)    
    accountExternalIdDebit: string;

    @IsUUID(4)    
    accountExternalIdCredit: string;

    @IsNumber()
    @IsIn(Object.keys(TRANSFER_TYPES).map(Number))
    tranferTypeId: number;
    
    @IsNumber()
    @Min(0)
    value: number;
}


export class TransactionDto {
    constructor(
        public readonly transactionExternalId: string,
        public readonly value: number,
        public readonly createdAt: Date,
        public readonly transactionStatus: {
            name: string,
        },
        public readonly transactionType: {
            name: string,
        },
    ){}
    
    static fromDomain(order: {
        transactionExternalId: string;
        value: number;
        createdAt: Date;
        transactionStatus: string;
        transactionType: string
    }): TransactionDto {
        return new TransactionDto(
            order.transactionExternalId,
            order.value,
            order.createdAt,
            {
                name: order.transactionStatus
            },
            {
                name: order.transactionType
            }
        )
    }
}