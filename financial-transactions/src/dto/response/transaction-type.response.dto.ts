/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class TransactionTypeResponseDto {

    constructor(name: string) {
        this.name = name
    }

    @IsString()
    name: string;

}