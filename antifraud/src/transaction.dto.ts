import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TransactionDto {
    @IsString()
    @IsNotEmpty()
    readonly transactionExternalId: string;

    @IsNumber()
    @IsNotEmpty()
    readonly value: number;
}