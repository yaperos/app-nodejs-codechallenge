import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class EvaluateTransactionDto {
    @IsUUID()
    @IsNotEmpty()
    transactionId: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;

    @IsOptional()
    @IsString()
    status?: string;
}