/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class TransactionStatusResponseDto {

    constructor(name: string) {
        this.name = name
    }


    @IsString()
    name: string;

}