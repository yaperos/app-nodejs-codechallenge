/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class TransactionCreateResponseDto {

    @IsString()
    transactionStatus: string;

    @IsString()
    transactionDate: string;

}