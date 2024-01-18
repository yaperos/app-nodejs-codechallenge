import {IsNotEmpty, IsString} from 'class-validator';

export class TransactionDto {
    @IsNotEmpty()
    @IsString()
    transactionExternalId: string;
}