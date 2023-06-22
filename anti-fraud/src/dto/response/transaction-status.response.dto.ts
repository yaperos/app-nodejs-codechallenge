/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from 'class-validator';

export class TransactionStatusResponseDto {

    constructor(transactionExternalId: string, transactionStatus: string) {
        this.transactionExternalId = transactionExternalId;
        this.transactionStatus = transactionStatus
    }

    @IsNumber()
    transactionExternalId: string;

    @IsString()
    transactionStatus: string;

}