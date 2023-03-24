import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateTransactionRequest {
    @IsString()
    readonly accountExternalIdDebit: string;

    @IsString()
    readonly accountExternalIdCredit: string;

    @IsNumber()
    @IsNotEmpty()
    readonly transferTypeId: number;

    @IsNumber()
    @IsNotEmpty()
    readonly value: number;

}
export class CreateTransactionResponse {
    
    transactionExternalId: string;

    transactionType: any;

    transactionStatus: any;

    value: number;

    createdAt: Date;

    constructor(
        transactionExternalId: string,
        transactionType: any,
        transactionStatus: any,
        value: number,
        createdAt: Date
      ) {
        this.transactionExternalId = transactionExternalId;
        this.transactionType = transactionType;
        this.transactionStatus = transactionStatus;
        this.value = value;
        this.createdAt = createdAt;
      }

}