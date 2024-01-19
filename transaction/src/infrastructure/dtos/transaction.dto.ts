import {IsNotEmpty, IsString} from 'class-validator';

export class TransactionDto {
    @IsNotEmpty()
    @IsString()
    transactionId: string;
}