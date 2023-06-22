/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from 'class-validator';

export class TransactionStatusRequestDto {

    @IsNumber()
    transactionExternalId: string;

    @IsString()
    transactionStatus: string;

}