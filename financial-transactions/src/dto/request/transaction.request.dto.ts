/* eslint-disable prettier/prettier */
import { IsNumber } from 'class-validator';

export class TransactionRequestDto {

    @IsNumber()
    tranferTypeId: number;

    @IsNumber()
    value: number;
}