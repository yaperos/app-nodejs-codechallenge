import { IsString, IsNotEmpty, IsNumber, IsUUID, Min, Max } from 'class-validator';

export class CreateTransactionDto {

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    accountExternalIdDebit: string;

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    accountExternalIdCredit: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(2)
    transferTypeId: number;

    @IsNumber()
    @IsNotEmpty()
    value: number;
}

export enum TransactionType {
    IN = 1,
    OUT = 2
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}