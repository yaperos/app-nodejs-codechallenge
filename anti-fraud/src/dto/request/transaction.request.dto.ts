/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from 'class-validator';

export class TransactionRequestDto {

    @IsNumber()
    id: number;

    @IsString()
    transactionExternalId: string;

    @IsNumber()
    tranferTypeId: number;

    @IsNumber()
    value: number;
}